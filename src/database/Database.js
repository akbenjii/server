import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const Op = Sequelize.Op


export default class Database {

    constructor(config) {
        this.sequelize = new Sequelize(
            config.database,
            config.user,
            config.password, {
                host: config.host,
                dialect: config.dialect,
                logging: (config.debug) ? console.log : false
            })

        // Used to translate type id to string
        this.slots = ['color', 'head', 'face', 'neck', 'body', 'hand', 'feet', 'flag', 'photo', 'award']

        this.dir = `${__dirname}/models`
        this.loadModels()

        this.sequelize
            .authenticate()
            .then(() => {
                // Connected
            })
            .catch(error => {
                console.error(`[Database] Unable to connect to the database: ${error}`)
            })
    }

    loadModels() {
        fs.readdirSync(this.dir).forEach(model => {
            let modelImport = require(path.join(this.dir, model)).default
            let modelObject = modelImport.init(this.sequelize, Sequelize)

            let name = model.charAt(0).toLowerCase() + model.slice(1, -3)

            this[name] = modelObject
        })
    }

    async getItems() {
        let items = await this.getCrumb('items')
        items.slots = this.slots
        return items
    }

    async getCStamps() {
        return await this.getCrumb('stamps')
    }

    async getIgloos() {
        return await this.getCrumb('igloos')
    }

    async getFurnitures() {
        return await this.getCrumb('furnitures')
    }

    async getFloorings() {
        return await this.getCrumb('floorings')
    }

    async getRooms() {
        return await this.findAll('rooms', {
            raw: true
        })
    }

    async getWaddles() {
        return await this.findAll('waddles', {
            raw: true
        })
    }

    async getUserByUsername(username) {
        return await this.findOne('users', {
            where: {
                username: username
            }
        })
    }

    async getUserById(userId) {
        return await this.findOne('users', {
            where: {
                id: userId
            }
        })
    }

    async getAuthToken(userId, selector) {
        return await this.findOne('authTokens', {
            where: {
                userId: userId,
                selector: selector
            }
        })
    }

    async getActiveBan(userId) {
        var longestBan;
        let bans = await this.findAll('bans', {
            where: {
                userId: userId,
                expires: {
                    [Op.gt]: Date.now()
                }
            }
        })
        for (let x in bans) {
            if (!longestBan || bans[x].expires > longestBan.expires) {
                longestBan = bans[x]
            }
        }
        return longestBan
    }

    async getBanCount(userId) {
        return await this.bans.count({
            where: {
                userId: userId
            }
        })
    }

    async getBuddies(userId) {
        return await this.findAll('buddies', {
            where: {
                userId: userId
            },
            attributes: ['buddyId']

        }, [], (result) => {
            return result.map(result => result.buddyId)
        })
    }

    async getIgnores(userId) {
        return await this.findAll('ignores', {
            where: {
                userId: userId
            },
            attributes: ['ignoreId']

        }, [], (result) => {
            return result.map(result => result.ignoreId)
        })
    }

    async getInventory(userId) {
        return await this.findAll('inventories', {
            where: {
                userId: userId
            },
            attributes: ['itemId']

        }, [], (result) => {
            return result.map(result => result.itemId)
        })
    }

    async getStamps(userId) {
        return await this.findAll('userStamps', {
            where: {
                userId: userId
            },
            attributes: ['stampId']

        }, [], (result) => {
            return result.map(result => result.stampId)
        })
    }

    async getIglooInventory(userId) {
        return await this.findAll('iglooInventories', {
            where: {
                userId: userId
            },
            attributes: ['iglooId']

        }, [], (result) => {
            return result.map(result => result.iglooId)
        })
    }

    async getFurnitureInventory(userId) {
        return await this.findAll('furnitureInventories', {
            where: {
                userId: userId
            },
            attributes: ['itemId', 'quantity'],
            raw: true

        }, {}, (result) => {
            return this.arrayToObject(result, 'itemId', 'quantity')
        })
    }

    async getMascots() {
        return await this.findAll('mascots', {
            attributes: ['id', 'name', 'giveaway', 'stamp'],
            raw: true
        })
    }

    async getGiveaway(mascot) {
        return await this.findOne('mascots', {
            where: {
                id: mascot
            },
            attributes: ['giveaway'],
            raw: true
        })
    }

    async getIgloo(userId) {
        return await this.findOne('userIgloos', {
            where: {
                userId: userId
            },
            raw: true

        }, null, async (result) => {
            // Add furniture to igloo object
            result.furniture = await this.getUserFurnitures(userId)
            return result
        })
    }

    async getUserFurnitures(userId) {
        return await this.findAll('userFurnitures', {
            where: {
                userId: userId
            },
            raw: true

        }, [], (result) => {
            // Removes user id from all objects in furniture array
            return result.map(({
                userId,
                ...furnitures
            }) => furnitures)
        })
    }

    async getWorldPopulations() {
        return await this.getCrumb('worlds')
    }

    async getUnverifedUsers(userId) {
        return await this.findAll('users', {
            where: {
                username_approved: "0",
                username_rejected: "0"
            }
        })
    }

    async searchForUsers(username) {

        let exactMatch = await this.findOne('users', {
            where: {
                username: username
            }
        })

        let closeMatch = await this.findAll('users', {
            where: {
                username: {
                    [Op.like]: '%' + username + '%'
                }
            }
        })

        if (!exactMatch) {
            return closeMatch
        } else {
            for (var i = closeMatch.length - 1; i >= 0; i--) {
                if (closeMatch[i].username === exactMatch.username) {
                    closeMatch.splice(i, 1);
                }
            }
            closeMatch.unshift(exactMatch)
            return closeMatch
        }
    }

    async addCoins(userID, coins) {
        let user = await this.getUserById(userID)

        this.users.update({
            coins: parseInt(user.dataValues.coins) + parseInt(coins)
        }, {
            where: {
                id: userID
            }
        })
    }

    async addItem(userID, item) {
        var inventory = await this.getInventory(userID)
        var checkItem = await this.findOne('items', {
            where: {
                id: item
            }
        })

        // A user having 2 of the same items would probably cause some issues

        if (inventory.includes(item)) {
            return
        }

        // If an item that doesn't exist is added to a user, the game will crash on load

        if (!checkItem) {
            return
        }

        this.inventories.create({
            userId: userID,
            itemId: item
        })

        return true

    }

    async ban(userId, banDuration, modId) {
        this.bans.create({
            userId: userId,
            expires: banDuration,
            moderatorId: modId
        })
    }

    async changeUsername(userId, newUsername) {

        if (newUsername.length < 4) return false
        if (newUsername.length > 16) return false

        let existingUser = await this.getUserByUsername(newUsername)
        if (existingUser) return false

        this.users.update({
            username: newUsername
        }, {
            where: {
                id: userId
            }
        })

        return true
    }

    async updatePassword(userId, password) {
        if (password.length < 5) return false
        if (password.length > 32) return false
        let hash = await bcrypt.hash(password, 10)
        this.users.update({
            password: hash
        }, {
            where: {
                id: userId
            }
        })
        return true
    }

    async getPuffles(userId) {
        return await this.findAll('userPuffles', {
            where: {
                userId: userId
            },
            attributes: ['id', 'color', 'name']
        })
    }

    async getWellbeing(puffleId) {
        return await this.findOne('userPuffles', {
            where: {
                id: puffleId
            },
            attributes: ['food', 'play', 'rest', 'clean', 'name']
        })
    }

    async getPuffleColor(puffleId) {
        return await this.findOne('userPuffles', {
            where: {
                id: puffleId
            },
            attributes: ['color']
        })
    }

    async getPuffleCount(userId) {
        let puffles = await this.findAll('userPuffles', {
            where: {
                userId: userId
            },
            attributes: ['id']
        })
        return puffles.length
    }

    async getPuffleCost(puffleId) {
        return await this.findOne('puffles', {
            where: {
                id: puffleId
            },
            attributes: ['cost']
        })
    }

    async adoptPuffle(userId, type, name) {
        let puffle = await this.userPuffles.create({
            userId: userId,
            color: type,
            name: name
        })
        return puffle
    }

    async getReleasedItems(user) {
        let releasedItems = await this.findAll('items', {
            where: {
                latestRelease: {
                    [Op.gt]: new Date(user.data.joinTime)
                }
            }
        })
        let releasedItemIDs = []

        for (var x in releasedItems) {
            releasedItemIDs.push(releasedItems[x].dataValues.id)
        }

        let obtainableItems = await this.findAll('items', {
            where: {
                obtainable: 1
            }
        })

        for (var x in obtainableItems) {
            if (!releasedItemIDs.includes(obtainableItems[x].dataValues.id)) {
                releasedItemIDs.push(obtainableItems[x].dataValues.id)
            }
        }

        return releasedItemIDs
    }

    async getReleasedPins(user) {

        let releasedPins = await this.findAll('items', {
            where: {
                latestRelease: {
                    [Op.gt]: user.data.joinTime
                },
                type: 8
            }
        })

        let releasedPinIDs = []

        for (var x in releasedPins) {
            releasedPinIDs.push(releasedPins[x].dataValues.id)
        }

        let obtainablePins = await this.findAll('items', {
            where: {
                obtainable: 1,
                type: 8
            }
        })

        for (var x in obtainablePins) {
            if (!releasedPinIDs.includes(obtainablePins[x].dataValues.id)) {
                releasedPinIDs.push(obtainablePins[x].dataValues.id)
            }
        }

        return releasedPinIDs
    }

    async getTeam(userId) {
        let team = await this.findOne('partyCompletion', {
            where: {
                penguinId: userId,
                party: "PenguinGames0722",
                info: "team"
            },
            attributes: ['value']
        })
        if (team) return team.value
        return undefined
    }

    async setTeam(userId, team) {
        this.partyCompletion.create({
            penguinId: userId,
            party: "PenguinGames0722",
            info: "team",
            value: team
        })
    }

    async getPartyCompletion(userId, party) {
        let completion = await this.findAll('partyCompletion', {
            where: {
                penguinId: userId,
                party: party
            },
            attributes: ['info', 'value']
        })
        return this.arrayToObject(completion, 'info', 'value')
    }

    async submitScore(userId, game, score) {
        let data;
        let scoreEntry = await this.findOne('partyCompletion', {
            where: {
                penguinId: userId,
                party: "PenguinGames0722",
                info: game
            },
            attributes: ['value']
        })
        if (scoreEntry) {
            data = await this.partyCompletion.update({
                value: parseInt(scoreEntry.value) + score
            }, {
                where: {
                    penguinId: userId,
                    party: "PenguinGames0722",
                    info: game
                }
            })
        } else {
            data = await this.partyCompletion.create({
                penguinId: userId,
                party: "PenguinGames0722",
                info: game,
                value: score
            })
        }
        return data
    }

    async getLeaderboardData(game) {
        let blueTeamScores = []
        let redTeamScores = []

        let blueTotal = 0
        let redTotal = 0

        let blueTeamMembers = await this.findAll('partyCompletion', {
            where: {
                party: "PenguinGames0722",
                info: "team",
                value: "blue"
            },
            attributes: ['penguinId']
        })
        let redTeamMembers = await this.findAll('partyCompletion', {
            where: {
                party: "PenguinGames0722",
                info: "team",
                value: "red"
            },
            attributes: ['penguinId']
        })
        for (var x in blueTeamMembers) {
            let username = (await this.findOne('users', {
                where: {
                    id: blueTeamMembers[x].penguinId
                },
                attributes: ['username']
            }))
            if (!username) {
                continue
            } else {
                username = username.username
            }
            let score = (await this.findOne('partyCompletion', {
                where: {
                    penguinId: blueTeamMembers[x].penguinId,
                    party: "PenguinGames0722",
                    info: game
                },
                attributes: ['value']
            }))
            if (!score) {
                continue
            } else {
                score = score.value
            }
            blueTeamScores.push([username, score])
            blueTotal = parseInt(blueTotal) + parseInt(score)
        }
        for (var x in redTeamMembers) {
            let username = (await this.findOne('users', {
                where: {
                    id: redTeamMembers[x].penguinId
                },
                attributes: ['username']
            }))
            if (!username) {
                continue
            } else {
                username = username.username
            }
            let score = (await this.findOne('partyCompletion', {
                where: {
                    penguinId: redTeamMembers[x].penguinId,
                    party: "PenguinGames0722",
                    info: game
                },
                attributes: ['value']
            }))
            if (!score) {
                continue
            } else {
                score = score.value
            }
            redTeamScores.push([username, score])
            redTotal = parseInt(redTotal) + parseInt(score)
        }
        blueTeamScores.sort(function (a, b) {
            return b[1] - a[1]
        })
        redTeamScores.sort(function (a, b) {
            return b[1] - a[1]
        })
        if (blueTeamScores.length > 5) blueTeamScores = blueTeamScores.slice(0, 5)
        if (redTeamScores.length > 5) redTeamScores = redTeamScores.slice(0, 5)
        return {
            leaderboard: game,
            blueTotal: blueTotal,
            blueLeaderboard: blueTeamScores,
            redTotal: redTotal,
            redLeaderboard: redTeamScores
        }
    }

    async setTotals(handler) {
        let blueTeamScores = []
        let redTeamScores = []

        let blueTotal = 0
        let redTotal = 0

        let blueTeamMembers = await this.findAll('partyCompletion', {
            where: {
                party: "PenguinGames0722",
                info: "team",
                value: "blue"
            },
            attributes: ['penguinId']
        })
        let redTeamMembers = await this.findAll('partyCompletion', {
            where: {
                party: "PenguinGames0722",
                info: "team",
                value: "red"
            },
            attributes: ['penguinId']
        })
        for (var x in blueTeamMembers) {
            let scoreTotal = 0
            let username = (await this.findOne('users', {
                where: {
                    id: blueTeamMembers[x].penguinId
                },
                attributes: ['username']
            }))
            if (!username) {
                continue
            } else {
                username = username.username
            }

            for (var game of handler.partyData.games) {
                let score = (await this.findOne('partyCompletion', {
                    where: {
                        penguinId: blueTeamMembers[x].penguinId,
                        party: "PenguinGames0722",
                        info: game
                    },
                    attributes: ['value']
                }))
                if (!score) {
                    continue
                } else {
                    score = score.value
                }
                scoreTotal = parseInt(scoreTotal) + parseInt(score)
                
            }

            blueTeamScores.push([username, scoreTotal])
            blueTotal = parseInt(blueTotal) + parseInt(scoreTotal)
        }
        for (var x in redTeamMembers) {
            let scoreTotal = 0
            let username = (await this.findOne('users', {
                where: {
                    id: redTeamMembers[x].penguinId
                },
                attributes: ['username']
            }))
            if (!username) {
                continue
            } else {
                username = username.username
            }

            for (var game of handler.partyData.games) {
                let score = (await this.findOne('partyCompletion', {
                    where: {
                        penguinId: redTeamMembers[x].penguinId,
                        party: "PenguinGames0722",
                        info: game
                    },
                    attributes: ['value']
                }))
                if (!score) {
                    continue
                } else {
                    score = score.value
                }
                scoreTotal = parseInt(scoreTotal) + parseInt(score)
            }
            redTeamScores.push([username, scoreTotal])
            redTotal = parseInt(redTotal) + parseInt(scoreTotal)
        }

        handler.partyData.blueTotal = blueTotal
        handler.partyData.redTotal = redTotal

        blueTeamScores.sort(function (a, b) {
            return b[1] - a[1]
        })
        redTeamScores.sort(function (a, b) {
            return b[1] - a[1]
        })
        if (blueTeamScores.length > 5) blueTeamScores = blueTeamScores.slice(0, 5)
        if (redTeamScores.length > 5) redTeamScores = redTeamScores.slice(0, 5)

        handler.partyData.blueLeaderboard = blueTeamScores
        handler.partyData.redLeaderboard = redTeamScores
    }

    async getPostcards(userId) {
        let postcards = await this.findAll('userPostcards', {
            where: {
                userId: userId
            },
            attributes: ['id', 'userId', 'sender', 'time_sent', 'details']
        })
        return postcards
    }

    /*========== Helper functions ==========*/

    findOne(table, options = {}, emptyReturn = null, callback = null) {
        return this.find('findOne', table, options, emptyReturn, callback)
    }

    findAll(table, options = {}, emptyReturn = null, callback = null) {
        return this.find('findAll', table, options, emptyReturn, callback)
    }

    find(find, table, options, emptyReturn, callback) {
        return this[table][find](options).then((result) => {

            if (callback && result) {
                return callback(result)
            } else if (result) {
                return result
            } else {
                return emptyReturn
            }
        })
    }

    async getCrumb(table) {
        return await this.findAll(table, {
            raw: true

        }, {}, (result) => {
            return this.arrayToObject(result, 'id')
        })
    }

    arrayToObject(array, key, value = null) {
        return array.reduce((obj, item) => {
            // If a value is passed in then the key will be mapped to item[value]
            let result = (value) ? item[value] : item

            obj[item[key]] = result
            delete item[key]

            return obj
        }, {})
    }

}