"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Actions extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'send_position': this.sendPosition,
      'send_frame': this.sendFrame,
      'snowball': this.snowball,
      'stamp_earned': this.stampEarned,
      'save_stampbook': this.saveStampbook
    };
  }

  sendPosition(args, user) {
    user.x = args.x;
    user.y = args.y;
    user.frame = 1;
    user.room.send(user, 'send_position', {
      id: user.data.id,
      x: args.x,
      y: args.y
    });
  }

  sendFrame(args, user) {
    if (args.set) {
      user.frame = args.frame;
    } else {
      user.frame = 1;
    }

    user.room.send(user, 'send_frame', {
      id: user.data.id,
      frame: args.frame,
      set: args.set
    });
  }

  snowball(args, user) {
    user.snowballsThrownThisSession++;
    user.room.send(user, 'snowball', {
      id: user.data.id,
      x: args.x,
      y: args.y
    });
  }

  async stampEarned(args, user) {
    args.stamp = parseInt(args.stamp);

    if (user.stamps.includes(args.stamp)) {
      return user.send('error', {
        error: 'You already have this stamp'
      });
    }

    let stamp = await user.stamps.add(args.stamp);

    if (!stamp) {
      return user.send('error', {
        error: 'Could not add stamp'
      });
    }

    user.send('stamp_earned', {
      stamp: args.stamp
    });
  }

  saveStampbook(args, user) {
    user.data.stampbookColor = args.color;
    user.data.stampbookClasp = args.clasp;
    user.data.stampbookPattern = args.pattern;
    user.update({
      stampbookColor: user.data.stampbookColor,
      stampbookClasp: user.data.stampbookClasp,
      stampbookPattern: user.data.stampbookPattern
    });
  }

}

exports.default = Actions;