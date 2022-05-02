"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _discord = require("discord.js");

class Discord {
  constructor(config) {
    this.ready = false;
    this.config = config;
    const token = config.discordbottoken;
    const dcbot = new _discord.Client({
      intents: [_discord.Intents.FLAGS.GUILDS]
    });
    this.dcbot = dcbot;
    this.dcbot.once('ready', () => {
      console.log('CPForever Discord Logging Ready!');
      this.ready = true;
    });
    this.dcbot.login(token);
  }

  logChatMessage(username, message, room, toxicity, profanity, sexual) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.chatlogchannel);
    channel.send(`**USER:** ${username}\n**SENT MESSAGE:** ${message}\n**IN ROOM:** ${room}\n**TOXICITY:** ${toxicity}\n**PROFANITY:** ${profanity}\n**SEXUAL:** ${sexual}`);
  }

  logLogin(username) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.loginlogchannel);
    channel.send(`**USER:** ${username} **LOGGED IN**`);
  }

  kickLogs(moderator, user) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **KICKED USER** ${user}`);
  }

  banLogs(moderator, user, duration, expires) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **BANNED USER** ${user} **FOR** ${duration} **UNTIL** ${expires}`);
  }

  addItemLogs(moderator, user, item) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED ITEM** ${item} **TO USER** ${user}`);
  }

  addCoinLogs(moderator, user, coins) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **ADDED** ${coins} **COINS TO USER** ${user}`);
  }

  changeUsernameLogs(moderator, oldname, newname) {
    if (!this.ready) return;
    const channel = this.dcbot.channels.cache.get(this.config.modlogchannel);
    channel.send(`**MODERATOR:** ${moderator} **CHANGED THE USERNAME OF** ${oldname} **TO** ${newname}`);
  }

  errorAlert(error) {
    if (!this.ready) return;
    const botadmin = this.dcbot.users.fetch(this.config.botowner);
    botadmin.send(`**ERROR:** ${error} **REPORTED**`);
  }

}

exports.default = Discord;