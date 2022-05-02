"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Moderation extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'mute_player': this.mutePlayer,
      'kick_player': this.kickPlayer,
      'ban_player': this.banPlayer,
      'stealth_mode': this.stealthMode,
      'warn_player': this.warnPlayer
    };
  }

  mutePlayer(args, user) {}

  kickPlayer(args, user) {
    if (!user.isModerator) {
      return;
    }

    let recipient = this.usersById[args.id];

    if (recipient && recipient.data.rank < user.data.rank) {
      recipient.close();
      this.discord.kickLogs(user.data.username, recipient.data.username);
    }
  }

  warnPlayer(args, user) {
    if (!user.isModerator) {
      return;
    }

    let recipient = this.usersById[args.id];

    if (recipient && recipient.data.rank < user.data.rank) {
      recipient.send('error', {
        error: `You have been warned by a moderator!\nPlease follow the rules or you may be banned!`
      })();
    }
  }

  stealthMode(args, user) {
    if (!user.isModerator) {
      return;
    }

    this.db.users.update({
      stealthMode: args.stealthMode ? 0 : 1
    }, {
      where: {
        id: user.data.id
      }
    });
    let string = args.stealthMode ? 'disabled' : 'enabled';
    user.send('error', {
      error: `Stealth mode ${string}\nPlease relogin.`
    })();
  }

  async banPlayer(args, user) {
    if (!user.isModerator) {
      return;
    }

    let recipient = this.usersById[args.id];
    let recipientRank = await this.getRecipientRank(recipient, args.id);

    if (recipientRank < user.data.rank) {
      await this.applyBan(user, args.id);

      if (recipient) {
        recipient.close();
      }
    }
  }

  async applyBan(moderator, id, hours = 24, message = '') {
    let expires = Date.now() + hours * 60 * 60 * 1000;
    let banCount = await this.db.getBanCount(id); // 5th ban is a permanent ban

    if (banCount >= 4) {
      this.db.users.update({
        permaBan: true
      }, {
        where: {
          id: id
        }
      });
    }

    this.db.bans.create({
      userId: id,
      expires: expires,
      moderatorId: moderator.data.id,
      message: message
    });
    let userName = (await this.db.getUserById(id)).username;
    this.discord.banLogs(moderator.data.username, userName, expires);
  }

  async getRecipientRank(recipient, id) {
    return recipient ? recipient.data.rank : (await this.db.getUserById(id)).rank;
  }

}

exports.default = Moderation;