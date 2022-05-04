"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Get extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'get_player': this.getPlayer,
      'get_rank': this.getRank
    };
  }

  async getPlayer(args, user) {
    if (!args.id) {
      return;
    }

    if (args.id in this.usersById) {
      user.send('get_player', {
        penguin: this.usersById[args.id].string
      });
      return;
    }

    let userData = await this.db.getUserById(args.id);
    let {
      banned,
      coins,
      loginKey,
      password,
      rank,
      joinTime,
      permaBan,
      ...penguin
    } = userData.dataValues;

    if (userData) {
      user.send('get_player', {
        penguin: penguin
      });
    }
  }

  async getRank(args, user) {
    if (!args.id) {
      return;
    }

    if (args.id in this.usersById) {
      user.send('get_rank', {
        rank: this.usersById[args.id].string
      });
      return;
    }

    let userData = await this.db.getUserById(args.id);
    let {
      banned,
      coins,
      loginKey,
      password,
      rank,
      joinTime,
      permaBan,
      ...penguin
    } = userData.dataValues;

    if (userData) {
      user.send('get_rank', {
        rank: rank
      });
    }
  }

}

exports.default = Get;