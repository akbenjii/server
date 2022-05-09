import Plugin from '../Plugin'

import Perspective from 'perspective-api-client'

export default class Chat extends Plugin {

    constructor(users, rooms) {
        super(users, rooms)
        this.events = {
            'send_message': this.sendMessage,
            'send_safe': this.sendSafe,
            'send_emote': this.sendEmote
        }

        this.commands = {
            'ai': this.addItem,
            'users': this.userPopulation,
            'broadcast': this.broadcast,
        }

        this.bindCommands()

        this.perspective = new Perspective({
            apiKey: this.config.perspectiveapikey
        });
    }

    // Events

    sendMessage(args, user) {
        // Todo: message validation
        if (args.message.startsWith('!')) {
            return this.processCommand(args.message.substring(1), user)
        }

        if (args.message.length < 1) {
            return
        }

        (async () => {
            try {
                const result = await this.perspective.analyze({
                    "comment": {
                        text: args.message
                    },
                    "languages": ["en"],
                    "requestedAttributes": {
                        "TOXICITY": {},
                        "SEXUALLY_EXPLICIT": {},
                        "PROFANITY": {}
                    }
                });
                const toxicity = result.attributeScores.TOXICITY.summaryScore.value * 100
                const profanity = result.attributeScores.PROFANITY.summaryScore.value * 100
                const sexual = result.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value * 100
                if (toxicity > 60 || profanity > 60 || sexual > 60) this.discord.logChatMessage(user.data.username, args.message, user.room.name, toxicity.toString().split(".")[0], profanity.toString().split(".")[0], sexual.toString().split(".")[0])
                if (profanity > 91 || sexual > 91) {
                    user.send('error', {
                        error: "Your message was not sent because our chat filter deems it unsuitable for the safe environment of CPF."
                    })
                    user.room.send(user, 'filtered_message', {
                        id: user.data.id,
                        message: args.message
                    }, [user], true)
                    return
                }
            } catch (err) {
                this.discord.errorAlert("Perspective API Error")
            }

            var filterWords = ['nigger', 'nigga', 'faggot', 'niggr', 'ngga', 'nga', 'fck', 'fk', 'niqqa', 'niqqer', 'faqqot', 'faggt', 'fag', 'faq', 'fuq', 'fuk', 'nood', 'nudes', 'noodes', 'slxt', 'cxnt', 'b!tch', 'bish', 'bich', 'bxtch', 'pxssy', 'poosy', 'pusea', 'pusy', 'bunda', 'puzzy', 'arse', 'azz', 'nxgger', 'niger', 'n!ger', 'n!g', 'nigg', 'nxgga', 'nga', 'nger', 'fxck', 'fucc', 'fuc', 'fuk', 'fxk', 'phuck', 'phuc', 'phxc', 'cxm', 'vxg', 'vag', 'forn', 'porn', 'pen!s', 'pxn!s', 'pxnis', 'penxs', 'mxther', 'motherfxcker', 'mofo', 'whore', 'whxre', 'whor', 'coc', 'cxck', 'sh!t', 'effin', 'eff!n', 'effxn', 'twt', 'twxt', 'thwat', 'sxx', 'sex', 'ass', 'ashole', 'ashxle', 'd!c', 'd!k', 'dik', 'dic', 'bxxb', 'boob', 'lmao', 'lmfao', 'cuck', 'peen', 'penls', 'dick', 'hoes', 'stfu']

            var str = args.message.toLowerCase()

            var contains = filterWords.some(element => {
                if (str.includes(element)) {
                    return true;
                }

                return false;
            });

            if (!contains) {
                user.room.send(user, 'send_message', {
                    id: user.data.id,
                    message: args.message,
                    filter: 'perspectiveapi'
                }, [user], true)
            }
            else {
                user.send('error', {
                    error: "Your message was not sent because our chat filter deems it unsuitable for the safe environment of CPF. Please let us know if you think this was an error!"
                })
                user.room.send(user, 'filtered_message', {
                    id: user.data.id,
                    message: args.message,
                    filter: 'manual'
                }, [user], true)
            }
        })();
    }

    sendSafe(args, user) {
        user.room.send(user, 'send_safe', {
            id: user.data.id,
            safe: args.safe
        }, [user], true)
    }

    sendEmote(args, user) {
        user.room.send(user, 'send_emote', {
            id: user.data.id,
            emote: args.emote
        }, [user], true)
    }

    // Commands

    bindCommands() {
        for (let command in this.commands) {
            this.commands[command] = this.commands[command].bind(this)
        }
    }

    processCommand(message, user) {
        let args = message.split(' ')
        let command = args.shift()

        if (command in this.commands) {
            return this.commands[command](args, user)
        }
    }

    addItem(args, user) {
        if (user.isCommands) {
            this.plugins.item.addItem({
                item: args[0]
            }, user)
        }
    }

    userPopulation(args, user) {
        user.send('error', {
            error: `Users online: ${this.handler.population}`
        })
    }

    broadcast(args, user) {
        if (user.data.rank < 5) return
        this.handler.broadcast(args.join(" "))
    }

}