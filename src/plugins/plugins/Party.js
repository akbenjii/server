import Plugin from '../Plugin'


export default class Party extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'pick_team': this.pickTeam,
            'get_party_completion': this.getPartyCompletion,
            'get_team_scores': this.getTeamScores,
            'get_leaderboard_data': this.getLeaderboardData,
        }

        this.handler.partyData.party = "PenguinGames0722"
        this.handler.partyData.games = ["aquagrabber", "astrobarrier", "beancounters", "cartsurfer", "hydrohopper", "icefishing", "jetpackadventure", "pizzatron", "four", "puffleroundup", "sled", "thinice"]
        this.setTotals()
    }

    setTotals() {
        this.db.setTotals(this.handler)
        setTimeout(() => this.setTotals, 60000)
    }

    async pickTeam(args, user) {
        let userTeam = await this.db.getTeam(user.data.id)
        if (!userTeam) {
            this.db.setTeam(user.data.id, args.team)
            user.send('pick_team', { team: args.team })
            user.partyData.team = args.team
        }
        else {
            user.send('pick_team', { team: userTeam })
        }
        
    }

    async getPartyCompletion(args, user) {
        let partyCompletion = await this.db.getPartyCompletion(user.data.id, args.party)
        if (partyCompletion) {
            user.send('get_party_completion', partyCompletion)
            if (partyCompletion.team) {
                user.partyData.team = partyCompletion.team
            }
        }
    }

    getTeamScores(args, user) {
        console.log(this.handler.partyData.blueTotal, this.handler.partyData.redTotal)
        user.send('get_team_scores', { blue: this.handler.partyData.blueTotal, red: this.handler.partyData.redTotal, blueLeaderboard: this.handler.partyData.blueLeaderboard, redLeaderboard: this.handler.partyData.redLeaderboard })
    }

    async getLeaderboardData(args, user) {
        let leaderboardData = await this.db.getLeaderboardData(args.game)
        user.send('get_leaderboard_data', leaderboardData)
    }

}
