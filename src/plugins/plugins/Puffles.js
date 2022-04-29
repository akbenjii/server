import Plugin from '../Plugin'


export default class Puffles extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'adopt_puffle': this.adoptPuffle,
            'get_puffles': this.getPuffles,
            'get_wellbeing': this.getWellbeing
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

}
