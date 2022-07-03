import Plugin from '../Plugin'


export default class Postcard extends Plugin {

    constructor(network) {
        super(network)
        this.events = {
            'update_postcards': this.updatePostcards,
            'send_postcard': this.sendPostcard,
        }
    }

    async updatePostcards(args, user) {
        await user.db.userPostcards.destroy({ where: { userId: user.data.id } })
        for (let postcard of args.postcardArray) {
            await user.db.userPostcards.create({ userId: user.data.id, id: postcard.id, sender: postcard.sender, time_sent: postcard.time_sent })
        }
    }

    async sendPostcard(args, user) {
        await user.db.userPostcards.create({ userId: args.recipient, id: args.id, sender: user.data.username })
        let recipient = this.usersById[args.recipient]
        if (recipient) {
            let postcards = await recipient.db.getPostcards(recipient.data.id)
            recipient.send('update_postcards', { postcards: postcards })
        }
    }
}