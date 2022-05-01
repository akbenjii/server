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
    this.send('start_game', {
      seats: this.users.length,
      users: users
    });
    super.gameReady();
  }

}

exports.default = SledInstance;