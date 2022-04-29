import Plugin from '../Plugin'


export default class Get extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'get_player': this.getPlayer,
            'get_rank': this.getRank
        }
    }

    async getPlayer(args, user) {
        if (!args.id) {
            return
        }

        if (args.id in this.usersById) {
            user.send('get_player', { penguin: this.usersById[args.id].string})
            return
        }

        let userData = await this.db.getUserById(args.id)
        let { banned, coins, loginKey, password, rank, joinTime, permaBan, ...penguin } = userData.dataValues

        if (userData) {
            user.send('get_player', { penguin: penguin })
        }
    }

    async getRank(args, user) {
        if (!args.id) {
            return
        }

        if (args.id in this.usersById) {
            user.send('get_rank', { rank: this.usersById[args.id].string })
            return
        }

        let userData = await this.db.getUserById(args.id)
        let { banned, coins, loginKey, password, rank, joinTime, permaBan, ...penguin } = userData.dataValues

        if (userData) {
            user.send('get_rank', { rank: rank })
        }
    }

}
