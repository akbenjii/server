import WaddleInstance from './WaddleInstance'


export default class FindFourInstance extends WaddleInstance {

    constructor(waddle) {
        super(waddle)
        waddle.users = this.users
    }

    // Functions

    init() {

        this.send('init_four', { users: [this.users[0].data.id, this.users[1].data.id], turn: this.users[0].data.id })

        super.gameReady()
    }

}
