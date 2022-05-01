"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Manage extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'delete_account': this.deleteAccount,
      'change_password': this.changePassword,
      'change_username': this.changeUsername
    };
  }

  async deleteAccount(args, user) {
    let userInstance = this.usersById[user.data.id];
    await this.db.users.destroy({
      where: {
        id: user.data.id
      }
    });
    if (userInstance) userInstance.close();
  }

  async changePassword(args, user) {
    let complete = this.db.changePassword(user.data.id, args.password);
    this.db.users.update({
      password: hash
    }, {
      where: {
        id: user.data.id
      }
    });
    if (complete) user.send('error', {
      error: 'Password change complete!'
    });
    if (!complete) user.send('error', {
      error: 'Password change failed! Passwords must be 6-32 characters long.'
    });
  }

  async changeUsername(args, user) {
    let complete = await this.db.changeUsername(user.data.id, args.username);
    this.db.users.update({
      username_approved: 0,
      username_rejected: 0
    }, {
      where: {
        id: user.data.id
      }
    });
    if (complete) user.send('error', {
      error: 'Username change complete! Please relogin.'
    });
    if (!complete) user.send('error', {
      error: 'Username change failed! This usually means the username was too short, long, or is already taken.'
    });
  }

}

exports.default = Manage;