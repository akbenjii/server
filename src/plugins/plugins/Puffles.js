import Plugin from '../Plugin'


export default class Puffles extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'adopt_puffle': this.adoptPuffle,
            'get_puffles': this.getPuffles,
            'get_wellbeing': this.getWellbeing,
            'stop_walking': this.stopWalking,
            'get_puffle_color': this.getPuffleColor,
        }
    }

    adoptPuffle(args, user) {
        let type = args.puffle
        let name = args.name
    }

    async getPuffles(args, user) {
        if (!args.userId) {
            return
        }
        let userId = args.userId
        let puffles = await this.db.getPuffles(userId)
        if (puffles) {
            user.send('get_puffles', {
                userId: userId,
                puffles: puffles
            })
        }
    }

    async getWellbeing(args, user) {
        if (!args.puffle) {
            return
        }
        let puffleId = args.puffle
        let wellbeing = await this.db.getWellbeing(puffleId)
        if (wellbeing) {
            user.send('get_wellbeing', {
                puffleId: puffleId,
                clean: wellbeing.clean,
                food: wellbeing.food,
                play: wellbeing.play,
                rest: wellbeing.rest
            })
        }
    }

    async stopWalking(args, user) {
        if (user.data.puffle !== 0){
            user.data.puffle = 0
            user.update({ walking: user.data.puffle})
            user.room.send(user, 'stop_walking', {user: user.data.id}, [])
        } 
    }

    async getPuffleColor(args, user) {
        if (!args.puffle) {
            return
        }
        let puffleId = args.puffle
        let puffleColor = await this.db.getPuffleColor(puffleId)
        if (puffleColor) {
            user.send('get_puffle_color', {
                penguinId: args.penguinId,
                color: puffleColor.color
            })
        }
    }
}
