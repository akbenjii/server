"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _WaddleInstance = _interopRequireDefault(require("./WaddleInstance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SledInstance extends _WaddleInstance.default {
  constructor(waddle) {
    super(waddle);
    this.id = 999;
    this.payouts = [20, 10, 5, 5];
  } // Events


  sendMove(args, user) {
    this.send('send_move', {
      id: args.id,
      x: args.x,
      y: args.y,
      time: args.time
    }, user);
  } // Functions


  gameReady() {
    let users = this.users.filter(Boolean).map(user => {
      return {
        username: user.data.username,
        color: user.data.color,
        hand: user.data.hand
      };
    });

    for (let user in this.users) {
      this.users[user].sledrace = this;
    }

    this.userInfo = users;
    this.send('start_game', {
      seats: this.users.length,
      users: users
    });
    super.gameReady();
  }

  setFinished(username, coins) {
    var allFinished = true;

    for (var user of this.userInfo) {
      if (user.username == username) {
        user.finished = true;
        user.coins = coins;
      }

      if (!user.finished) {
        allFinished = false;
      }
    }

    if (allFinished) {
      for (var user of this.users) {
        let coins = this.getUserCoins(user.data.username);
        user.send('game_over', {
          coins: user.data.coins
        });
        user.send('end_ruffle_mingame', {
          coins: user.data.coins,
          game: "sled",
          coinsEarned: coins,
          stamps: user.stamps.list
        });
        super.remove(user);
      }
    }
  }

  getUserCoins(username) {
    for (var user of this.userInfo) {
      if (user.username == username) {
        return user.coins;
      }
    }
  }

}

exports.default = SledInstance;