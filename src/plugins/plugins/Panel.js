import Plugin from '../Plugin'


export default class Panel extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'get_unverified_users': this.getUnverifedUsers,
            'verify_user': this.verifyUser,
            'reject_user': this.rejectUser,
            'get_user_info': this.getUserInfo,
            'edit_player': this.editPlayer,
            'add_user_coins': this.addUserCoins,
            'add_user_items': this.addUserItems,
            'ban_user': this.banUser,
            'change_user_name': this.changeUsername
        }
    }

    async getUnverifedUsers(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        let users = await this.db.getUnverifedUsers()

        if (users) {
            user.send('get_unverified_users', {
                users: users
            })
        }
    }

    async verifyUser(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        await this.db.users.update({
            username_approved: 1,
            username_rejected: 0
        }, {
            where: {
                id: args.id
            }
        })

        this.getUnverifedUsers(args, user)
    }

    async rejectUser(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        await this.db.users.update({
            username_rejected: 1,
            username_approved: 0
        }, {
            where: {
                id: args.id
            }
        })

        this.getUnverifedUsers(args, user)
    }

    async getUserInfo(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        let users = await this.db.searchForUsers(args.username)

        if (users) {
            user.send('get_unverified_users', {
                users: users
            })
        }

    }

    async editPlayer(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        let request = await this.db.getUserById(args.id)

        request.ip = null
        request.loginKey = null
        request.password = null

        let bans = await this.db.getBanCount(args.id)
        let activeban =  await this.db.getActiveBan(args.id)

        if (request) {
            user.send('edit_player', {
                user: request,
                bancount: bans,
                activeban: activeban
            })
        }
    }

    async addUserCoins(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
		}

        let userName = (await this.db.getUserById(args.id)).username

        user.send('error', {
            error: 'Coins added successfully.'
        })

        let recipient = this.usersById[args.id]


        if (recipient) {
            await recipient.updateCoins(parseInt(args.coins))
            recipient.send('end_ruffle_mingame', { coins: recipient.data.coins, game: 'Gift from a moderator!', coinsEarned: args.coins })
        }
        else {
            await this.db.addCoins(args.id, args.coins)
        }

        this.discord.addCoinLogs(user.data.username, userName, args.coins)
    }

    async addUserItems(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        let userName = (await this.db.getUserById(args.id)).username



            this.discord.addItemLogs(user.data.username, userName, args.itemName)

            let recipient = this.usersById[args.id]



            if (recipient) {
                let item = this.crumbs.items[args.item]
                recipient.inventory.add(args.item)
                recipient.send('add_item', { item: args.item, name: args.itemName, slot: this.crumbs.items.slots[item.type - 1], coins: recipient.data.coins })
                user.send('error', {
                    error: 'Item added successfully.'
                })
            }
            else {
                let item = this.db.addItem(args.id, args.item)

                if (item) {
                    user.send('error', {
                        error: 'Item added successfully.'
                    })
                }
            }
    }

    async banUser(args, user) {
        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }
        let recipient = this.usersById[args.id]
        let recipientRank = await this.getRecipientRank(recipient, args.id)

        if (recipientRank < user.data.rank) {
            let date = new Date()
            let expiry = date.getTime() + args.banDuration
            await this.db.ban(args.id, expiry, user.data.id)

            let userName = (await this.db.getUserById(args.id)).username
            let expiryDate = new Date(expiry)
			
			if (recipient) {
				recipient.send('close_with_error', {error: `You have been banned until ${expiryDate.toUTCString()}. Please make sure to follow the CPF rules.`})
                recipient.close()
            }

            user.send('error', {
                error: `Player banned until ${expiryDate.toUTCString()}`
            })

            this.discord.banLogs(user.data.username, userName, args.durationText, expiryDate.toUTCString())
        }

        else {
            user.send('error', {
                error: 'This user has the same permission level as you.'
            })
        }     
    }

    async changeUsername(args, user) {

        if (user.data.rank < 4) {
            user.send('error', {
                error: 'You do not have permission to perform this action.'
            })
			return
        }

        let userName = (await this.db.getUserById(args.id)).username

        let complete = await this.db.changeUsername(args.id, args.newUsername)

        if (complete) {
            user.send('error', {
                error: 'Username changed successfully.'
            })

            this.discord.changeUsernameLogs(user.data.username, userName, args.newUsername)
        }

    }

    async getRecipientRank(recipient, id) {
        return (recipient)
            ? recipient.data.rank
            : (await this.db.getUserById(id)).rank
    }

}
