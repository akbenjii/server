export default class Stamps {

    constructor(user, stamps) {
        this.user = user
        this.db = user.db
        this.stamps = user.crumbs.stamps
        this.list = stamps
    }

    includes(item) {
        return this.list.includes(item)
    }

    /**
     * Adds an item to the users inventory.
     *
     * @param {number} item - Item ID
     */
     async add(stamp) {
        this.list.push(stamp)

        // Db query
        try {
            return await this.db.userStamps.create({ userId: this.user.data.id, stampId: stamp })
        } catch (error) {
            console.log(error)
        }
    }

}
