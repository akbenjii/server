"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SledInstance = _interopRequireDefault(require("../instance/SledInstance"));

var _FindFourInstance = _interopRequireDefault(require("../instance/FindFourInstance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WaddleRoom {
  constructor(data) {
    Object.assign(this, data);
    this.users = new Array(data.seats).fill(null);
  }

  add(user) {
    let seat = this.users.indexOf(null);
    this.users[seat] = user;
    user.waddle = this; // Start game

    if (!this.users.includes(null) && this.game == 'sled') {
      return this.start();
    }

    user.send('join_waddle', {
      waddle: this.id,
      seat: seat,
      game: this.game
    });
    user.room.send(user, 'update_waddle', {
      waddle: this.id,
      seat: seat,
      username: user.data.username,
      game: this.game
    }, []);

    if (!this.users.includes(null)) {
      this.start();
    }
  }

  remove(user) {
    let seat = this.users.indexOf(user);
    this.users[seat] = null;
    user.waddle = null;
    user.room.send(user, 'update_waddle', {
      waddle: this.id,
      seat: seat,
      username: null
    }, []);
  }

  start() {
    let instance;
    if (this.game == 'sled') instance = new _SledInstance.default(this);
    if (this.game == 'four') instance = new _FindFourInstance.default(this);
    if (this.game !== 'four') this.reset();
    instance.init();
  }

  reset() {
    for (let [seat, user] of this.users.entries()) {
      if (user) {
        this.users[seat] = null;
        user.room.send(user, 'update_waddle', {
          waddle: this.id,
          seat: seat,
          username: null
        }, []);
      }
    }
  }

}

exports.default = WaddleRoom;