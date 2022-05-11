import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

import Plugin from '../Plugin'


export default class GameAuth extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'w#ga': this.gameAuth
        }
    }

    // Events

    async gameAuth(args, user) {
        let argsArray = args.split('|')
        // Already authenticated
        if (user.authenticated) {
            return
        }

        let userData = await user.db.getUserByUsername(argsArray[0])
        if (!userData) {
            return user.close()
        }

        user.data = userData

        // Full server
        if (this.handler.population > this.handler.maxUsers && !user.isModerator) {
            return user.close()
        }

        // Check banned
        let activeBan = await user.db.getActiveBan(user.data.id)
        if (activeBan || user.data.permaBan) {
            return user.close()
        }

        this.compareLoginKey(args, user)
    }

    // Functions

    async compareLoginKey(args, user) {
        let argsArray = args.split('|')
        let decoded
        let token

        // Verify JWT
        try {
            decoded = jwt.verify(user.data.loginKey, this.config.crypto.secret)
        } catch (err) {
            return user.close()
        }

        // Verify hash
        let address = user.socket.handshake.address
        let userAgent = user.socket.request.headers['user-agent']
        let match = await bcrypt.compare(`${user.data.username}${argsArray[1]}${address}${userAgent}`, decoded.hash)

        if (!match) {
            return user.close()
        }

        // Remove login key from database
        user.update({ loginKey: null })

        // Set selector for token destruction
        if (argsArray[2]) {
            user.token.oldSelector = argsArray[2]
        }

        // Create new token
        if (argsArray[2]) {
            token = await this.genAuthToken(user)
        }

        // Disconnect if already logged in
        if (user.data.id in this.usersById) {
            this.usersById[user.data.id].close()
        }

        // Success
        this.usersById[user.data.id] = user
        await this.discord.logLogin(user.data.username)

        await user.setBuddies(await user.db.getBuddies(user.data.id))
        await user.setIgnores(await user.db.getIgnores(user.data.id))
        user.setInventory(await user.db.getInventory(user.data.id))
        user.setIglooInventory(await user.db.getIglooInventory(user.data.id))
        user.setFurnitureInventory(await user.db.getFurnitureInventory(user.data.id))

        user.authenticated = true

        // Send response
        user.sendGameAuth(true)
        if (token) {
            user.sendAuthToken(token)
        }

        // Update world population
        await this.handler.updateWorldPopulation()
    }

    async genAuthToken(user) {

        let userData = await this.db.getUserById(user.data.id)
        let password = userData.password
        let selector = userData.username
        let validator = password
        let validatorHash = await bcrypt.hash(validator, this.config.crypto.rounds)

        user.token.selector = selector
        user.token.validatorHash = validatorHash

        return `${selector}:${validator}`
    }

}
