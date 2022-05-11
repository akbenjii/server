import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import Validator from 'fastest-validator'


/**
 * Dedicated login server handler that validates user credentials.
 */
export default class LoginHandler {

    constructor(id, users, db, config) {
        this.id = id
        this.users = users
        this.db = db
        this.config = config

        this.check = this.createValidator()

        this.responses = {
            notFound: {
                success: false,
                message: 'Penguin not found. Try Again?'
            },
            wrongPassword: {
                success: false,
                message: 'Incorrect password. NOTE: Passwords are CaSe SeNsiTIVE'
            },
            permaBan: {
                success: false,
                message: 'Banned:\nYou are banned forever'
            }
        }
    }

    createValidator() {
        let validator = new Validator()

        let schema = {
            username: {
                empty: false,
                trim: true,
                type: 'string',
                min: 3,
                max: 12,
                messages: {
                    stringEmpty: 'You must provide your Penguin Name to enter CPForever',
                    stringMin: 'Your Penguin Name is too short. Please try again',
                    stringMax: 'Your Penguin Name is too long. Please try again',
                }
            },
            password: {
                empty: false,
                trim: true,
                type: 'string',
                min: 3,
                max: 128,
                messages: {
                    stringEmpty: 'You must provide your password to enter CPForever',
                    stringMin: 'Your password is too short. Please try again',
                    stringMax: 'Your password is too long. Please try again'
                }
            }
        }

        return validator.compile(schema)
    }

    handle(message, user) {
        let messageArray = message.split('%')
        try {
            switch (messageArray[1]) {
                case 'w#l':
                    this.login(messageArray[2], user)
                    break
                case 'w#tl':
                    this.tokenLogin(messageArray[2], user)
                    break
                default:
                    break
            }
        } catch (e) {
            console.error(`[DataHandler] Error: ${error}`)
        }
    }

    // Events

    async login(args, user) {
        let argsArray = args.split('|')

        let check = this.check({ username: argsArray[0], password: argsArray[1] })

        if (check != true) {
            // Invalid data input
            user.send('login', {
                success: false,
                message: check[0].message
            })

        } else {
            // Comparing password and checking for user existence
            let data = await this.comparePasswords(args, user.socket)
            console.log(data.populations)
            if (data) user.sendLogin(data.success, data.username, data.key, data.populations)
        }

        user.close()
    }

    async tokenLogin(args, user) {
        let data = await this.compareTokens(args, user.socket)
        console.log(data.populations)
        if (data) user.sendLogin(data.success, data.username, data.key, data.populations)
        user.close()
    }

    // Functions

    async comparePasswords(args, socket) {
        let argsArray = args.split('|')
        let user = await this.db.getUserByUsername(argsArray[0])
        if (!user) {
            return this.responses.notFound
        }

        let match = await bcrypt.compare(argsArray[1], user.password)
        if (!match) {
            return this.responses.wrongPassword
        }

        let banned = await this.checkBanned(user)
        if (banned) {
            return banned
        }

        return await this.onLoginSuccess(socket, user)
    }

    async compareTokens(args, socket) {
        let argsArray = args.split('|')
        let user = await this.db.getUserByUsername(argsArray[0])
        if (!user) {
            return this.responses.notFound
        }

        let split = argsArray[1].split(':')
        let token = await this.db.getAuthToken(user.id, split[0])
        if (!token) {
            return this.responses.wrongPassword
        }

        let match = await bcrypt.compare(split[1], token.validator)
        if (!match) {
            return this.responses.wrongPassword
        }

        let banned = await this.checkBanned(user)
        if (banned) {
            return banned
        }

        return await this.onLoginSuccess(socket, user)
    }

    async checkBanned(user) {
        if (user.permaBan) {
            return this.responses.permaBan
        }

        let activeBan = await this.db.getActiveBan(user.id)
        if (!activeBan) {
            return
        }

        let hours = Math.round((activeBan.expires - Date.now()) / 60 / 60 / 1000)
        return {
            success: false,
            message: `Banned:\nYou are banned for the next ${hours} hours`
        }
    }

    async onLoginSuccess(socket, user) {
        // Generate random key, used by client for authentication
        let randomKey = crypto.randomBytes(32).toString('hex')
        // Generate new login key, used to validate user on game server
        user.loginKey = await this.genLoginKey(socket, user, randomKey)

        let populations = await this.getWorldPopulations(user.rank > 3)

        // All validation passed
        await user.save()
        return {
            success: true,
            username: user.username,
            key: randomKey,
            populations: populations
        }
    }

    async genLoginKey(socket, user, randomKey) {
        let address = socket.handshake.address
        let userAgent = socket.request.headers['user-agent']

        // Create hash of login key and user data
        let hash = await bcrypt.hash(`${user.username}${randomKey}${address}${userAgent}`, this.config.crypto.rounds)

        // JWT to be stored on database
        return jwt.sign({
            hash: hash
        }, this.config.crypto.secret, { expiresIn: this.config.crypto.loginKeyExpiry })
    }

    async getWorldPopulations(isModerator) {
        let pops = await this.db.getWorldPopulations()
        var populations = []

        for (let world of Object.keys(pops)) {
            let maxUsers = this.config.worlds[world].maxUsers
            let population = pops[world].population

            let barSize = Math.round(maxUsers / 5)
            let bars = (population >= maxUsers) ? 6 : Math.max(Math.ceil(population / barSize), 1) || 1

            populations.push(`${world}:${bars}`)
        }

        return populations
    }

    close(user) {
        delete this.users[user.socket.id]
    }

}
