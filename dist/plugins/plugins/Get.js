"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Op = _sequelize.default.Op;

class Get extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'get_player': this.getPlayer,
      'get_rank': this.getRank,
      'get_pin': this.getPin,
      'get_statistics': this.getStatistics,
      'get_stampbook': this.getStampbook,
      'get_mascots': this.getMascots
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

  getPin(args, user) {
    user.send('get_pin', {
      id: 7147,
      room: 810,
      x: 910,
      y: 160
    });
  }

  async getStatistics(args, user) {
    let bans = await this.db.getBanCount(user.data.id);
    let itemsReleased = await this.db.getReleasedItems(user);
    let itemsOwned = user.inventory.list;
    let pinsReleased = await this.db.getReleasedPins(user);
    let pinsOwned = [];

    for (let item of itemsOwned) {
      for (let pin of pinsReleased) {
        if (item === pin) {
          pinsOwned.push(pin);
        }
      }
    }

    setTimeout(() => user.send('get_statistics', {
      joinTime: user.data.joinTime,
      messagesSent: user.data.messagesSent,
      timePlayed: user.data.timePlayed,
      sledRacesWon: user.data.sledRacesWon,
      findFourWon: user.data.findFourWon,
      coinsEarned: user.data.coinsEarned,
      coinsSpent: user.data.coinsSpent,
      snowballsThrown: user.data.snowballsThrown,
      banNumber: bans,
      itemsReleased: itemsReleased.length,
      itemsOwned: itemsOwned.length,
      pinsReleased: pinsReleased.length,
      pinsOwned: pinsOwned.length,
      partyTasksCompleted: user.data.partyTasksCompleted,
      hasBeenPOTW: user.data.hasBeenPOTW
    }), 1000);
  }

  async getStampbook(args, user) {
    let stamps = await this.db.getStamps(args.user);
    let target = await this.db.getUserById(args.user);
    let inventory = await this.db.getInventory(args.user);
    user.send('get_stampbook', {
      username: target.dataValues.username,
      stamps: stamps,
      color: target.dataValues.stampbookColor,
      clasp: target.dataValues.stampbookClasp,
      pattern: target.dataValues.stampbookPattern,
      inventory: inventory
    });
  }

  async getMascots(args, user) {
    let mascots = await this.db.getMascots();
    user.send('get_mascots', {
      mascots: mascots
    });
  }

}

exports.default = Get;