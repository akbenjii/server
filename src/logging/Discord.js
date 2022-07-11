import { Client, Intents } from 'discord.js'

export default class Discord {

    constructor(config) {
        this.ready = false
        this.config = config
        const token = config.discordbottoken
        const dcbot = new Client({
            intents: [Intents.FLAGS.GUILDS]
        });
        this.dcbot = dcbot
        this.dcbot.once('ready', () => {
            console.log('CPForever Discord Logging Ready!');
            this.ready = true
        });
        this.dcbot.login(token)
    }

    logChatMessage(username, message, room, toxicity, profanity, sexual) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.chatlogchannel)
        channel.send(`**USER:** ${username}\n**SENT MESSAGE:** ${message}\n**IN ROOM:** ${room}\n**TOXICITY:** ${toxicity}\n**PROFANITY:** ${profanity}\n**SEXUAL:** ${sexual}`);
    }

    logLogin(username) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.loginlogchannel)
        channel.send(`**USER:** ${username} **LOGGED IN**`);
    }

    kickLogs(moderator, user) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.modlogchannel)
        channel.send(`**MODERATOR:** ${moderator} **KICKED USER** ${user}`);
    }

    banLogs(moderator, user, duration, expires) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.modlogchannel)
        channel.send(`**MODERATOR:** ${moderator} **BANNED USER** ${user} **FOR** ${duration} **UNTIL** ${expires}`);
    }

    addItemLogs(moderator, user, item) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.modlogchannel)
        channel.send(`**MODERATOR:** ${moderator} **ADDED ITEM** ${item} **TO USER** ${user}`);
    }

    addCoinLogs(moderator, user, coins) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.modlogchannel)
        channel.send(`**MODERATOR:** ${moderator} **ADDED** ${coins} **COINS TO USER** ${user}`);
    }

    changeUsernameLogs(moderator, oldname, newname) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get(this.config.modlogchannel)
        channel.send(`**MODERATOR:** ${moderator} **CHANGED THE USERNAME OF** ${oldname} **TO** ${newname}`);
    }

    reportPlayer(reason, username, id, reporterUsername) {
        if (!this.ready) return
        const channel = this.dcbot.channels.cache.get("996152869994639410")
        if (reason == "lang") {
            channel.send({ content: `**USER:** ${reporterUsername} **REPORTED** ${username} **FOR INAPPROPRIATE LANGUAGE**\nPlease can a <@&968646503834988555> review the most recent lines on the attached chat log.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`, files: [{ attachment: `./logs/chat/${id}.log`, name: `${username}-log.txt`}] });
        }
        else if (reason == "name") {
            channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE USERNAME**\nPlease can a <@&968646503834988555> research this username in more detail to check if it is inappropriate or not.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
        }
        else if (reason == "igloo") {
            channel.send(`**USER:** ${reporterUsername} **REPORTED** ${username} **FOR HAVING AN INAPPROPRIATE IGLOO**\nPlease can a <@&968646503834988555> log on and review the suitability of their igloo.\nTIP: If taking action, remember to copy-paste the username into the mod panel in case they use something like a capital i instead of an L`);
        }
    }

    errorAlert(error) {
        if (!this.ready) return
        const botadmin = this.dcbot.users.fetch(this.config.botowner)
        botadmin.send(`**ERROR:** ${error} **REPORTED**`);
    }
}