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
        let recipientUser = await user.db.getUserByUsername(args.username)
        if (recipientUser) {
            args.recipient = recipientUser.dataValues.id
        }
        else {
            return user.send('error', { error: 'There is no user with that username!' })
        }
        let recipientPostcards = await user.db.getPostcards(args.recipient)
        if (recipientPostcards.length >= 100) {
            return user.send('error', { error: "That user's mailbow is full!" })
        }
        if (user.data.coins < 10) return user.send('error', { error: 'You do not have enough coins to send a postcard.' })
        user.updateCoins(-10)
        await user.db.userPostcards.create({ userId: args.recipient, id: args.id, sender: user.data.username })
        let recipient = this.usersById[args.recipient]
        if (recipient) {
            recipient.postcards = await recipient.db.getPostcards(recipient.data.id)
            recipient.send('update_postcards', { postcards: recipient.postcards })
        }
        user.send('send_postcard', { coins: user.data.coins })
    }
}