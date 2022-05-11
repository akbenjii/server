import Plugin from '../Plugin'
import Igloo from '../../objects/room/Igloo'


export default class Join extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'p#lp': this.loadPlayer,
            'join_server': this.joinServer,
            'join_room': this.joinRoom,
            'join_igloo': this.joinIgloo
        }
    }

    // Events

    loadPlayer(args, user) {
        user.room = this.getRandomSpawn()

        user.sendLoadPlayer(user.string, user.room.id, user.data.joinTime, user.buddy.list, user.ignore.list, user.inventory.list, user.iglooInventory.list, user.furnitureInventory.list)
    }

    joinServer(args, user) {
        // Update token on database now that user has fully connected
        if (user.token.oldSelector) {
            this.db.authTokens.destroy({ where: { userId: user.data.id, selector: user.token.oldSelector } })
        }

        if (user.token.selector && user.token.validatorHash) {
            this.db.authTokens.create({ userId: user.data.id, selector: user.token.selector, validator: user.token.validatorHash })
        }

        user.room.add(user)
    }

    // Limit this to 1/2 uses per second
    joinRoom(args, user) {
        user.joinRoom(this.rooms[args.room], args.x, args.y)
    }

    async joinIgloo(args, user) {
        let igloo = await this.getIgloo(args.igloo)
        user.joinRoom(igloo, args.x, args.y)
    }

    // Functions

    getRandomSpawn() {
        let spawns = Object.values(this.rooms).filter(room => room.spawn && !room.isFull)

        // All spawns full
        if (!spawns.length) {
            spawns = Object.values(this.rooms).filter(room => !room.game && !room.isFull)
        }

        return spawns[Math.floor(Math.random() * spawns.length)]
    }

    async getIgloo(id) {
        let internalId = id + this.config.game.iglooIdOffset // Ensures igloos are above all default rooms

        if (!(internalId in this.rooms)) {
            let igloo = await this.db.getIgloo(id)
            if (!igloo) return null

            this.rooms[internalId] = new Igloo(igloo, this.db, this.config.game.iglooIdOffset)
        }

        return this.rooms[internalId]
    }

}
