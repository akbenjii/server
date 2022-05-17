import Room from '../objects/room/Room'
import WaddleRoom from '../objects/room/WaddleRoom'
import OpenIgloos from '../objects/room/OpenIgloos'
import PluginManager from '../plugins/PluginManager'


export default class DataHandler {

    constructor(id, users, db, config, discord) {
        this.id = id
        this.users = users
        this.db = db
        this.config = config
        this.discord = discord

        this.usersById = {}
        this.maxUsers = config.worlds[id].maxUsers

        this.openIgloos = new OpenIgloos()

        this.init()
    }

    async init() {
        this.crumbs = {
            items: await this.db.getItems(),
            igloos: await this.db.getIgloos(),
            furnitures: await this.db.getFurnitures(),
            floorings: await this.db.getFloorings()
        }

        this.rooms = await this.setRooms()

        await this.setWaddles()

        this.plugins = new PluginManager(this)

        this.updateWorldPopulation()
    }

    async setWaddles() {
        let waddles = await this.db.getWaddles()

        for (let waddle of waddles) {
            this.rooms[waddle.roomId].waddles[waddle.id] = new WaddleRoom(waddle)
        }
    }

    async setRooms() {
        let roomsData = await this.db.getRooms()
        let rooms = {}

        for (let data of roomsData) {
            rooms[data.id] = new Room(data, this)
        }

        return rooms
    }

    handle(message, user) {
        message.split('\xdd').filter(Boolean).forEach(packet => {
            try {
                let parsed = JSON.parse(packet)
                console.log(`[DataHandler] Received: ${parsed.action} ${JSON.stringify(parsed.args)}`)

                // Only allow game_auth until user is authenticated
                if (!user.authenticated && parsed.action != 'game_auth') {
                    return user.close()
                }

                this.fireEvent(parsed.action, parsed.args, user)

                user.onPacketSent()

            } catch(error) {
                console.error(`[DataHandler] Error: ${error}`)
            }
        })
    }

    fireEvent(event, args, user) {
        this.plugins.getEvent(event, args, user)
    }

    close(user) {
        if (!user) {
            return
        }

        user.updateStats()

        setTimeout(() => {

        if (user.room) {
            user.room.remove(user)
        }

        if (user.buddy) {
            user.buddy.sendOffline()
        }

        if (user.waddle) {
            user.waddle.remove(user)
        }

        if (user.data && user.data.id && user.data.id in this.usersById) {
            delete this.usersById[user.data.id]
        }

        if (user.data && user.data.id) {
            this.openIgloos.remove(user)
        }

        delete this.users[user.socket.id]

        this.updateWorldPopulation()
        }, 2500)
    }

    get population() {
        return Object.keys(this.users).length
    }

    async updateWorldPopulation() {
        this.db.worlds.update({ population: this.population }, { where: { id: this.id }})
    }

    broadcast(message) {
        for (let user of Object.values(this.users)) {
            user.send('error', { error: message })
        }
    }
}
