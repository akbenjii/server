"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _discord = require("discord.js");

class Discord {
  constructor(config) {
    this.config = config;
    const token = config.discordbottoken;
    const dcbot = new _discord.Client({
      intents: [_discord.Intents.FLAGS.GUILDS]
    });
    this.dcbot = dcbot;
    this.dcbot.once('ready', () => {
      console.log('CPV Discord Logging Ready!');
    });
    this.dcbot.login(token);
  }

  logChatMessage(username, message, room, toxicity, profanity, sexual) {
    const channel = this.dcbot.channels.cache.get(this.config.chatlogchannel);
    channel.send(`**USER:** ${username}\n**SENT MESSAGE:** ${message}\n**IN ROOM:** ${room}\n**TOXICITY:** ${toxicity}\n**PROFANITY:** ${profanity}\n**SEXUAL:** ${sexual}`);
  }

  logLogin(username) {
    const channel = this.dcbot.channels.cache.get(this.config.loginlogchannel);
    channel.send(`**USER:** ${username} **LOGGED IN**`);
  }

  kickLogs(moderator, user) {
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **KICKED USER** ${user}`);
  }

  banLogs(moderator, user, expires) {
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **BANNED USER** ${user} **UNTIL** ${expires}`);
  }

  addItemLogs(moderator, user, item) {
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED ITEM** ${item} **TO USER** ${user}`);
  }

  addCoinLogs(moderator, user, coins) {
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED** ${coins} **COINS TO USER** ${user}`);
  }

  changeUsernameLogs(moderator, oldname, newname) {
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **CHANGED THE USERNAME OF** ${oldname} **TO** ${newname}`);
  }

  errorAlert(error) {
    const botadmin = this.dcbot.users.cache.get(this.config.botowner);
    botadmin.send(`**ERROR:** ${error} **REPORTED**`);
  }

}

exports.default = Discord;