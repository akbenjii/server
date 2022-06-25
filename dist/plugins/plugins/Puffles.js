"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Puffles extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'adopt_puffle': this.adoptPuffle,
      'get_puffles': this.getPuffles,
      'get_wellbeing': this.getWellbeing,
      'stop_walking': this.stopWalking,
      'get_puffle_color': this.getPuffleColor,
      'walk_puffle': this.walkPuffle
    };
  }

  adoptPuffle(args, user) {
    let type = args.puffle;
    let name = args.name;
  }

  async getPuffles(args, user) {
    if (!args.userId) {
      return;
    }

    let userId = args.userId;
    let puffles = await this.db.getPuffles(userId);

    if (puffles) {
      user.send('get_puffles', {
        userId: userId,
        puffles: puffles
      });
    }
  }

  async getWellbeing(args, user) {
    if (!args.puffle) {
      return;
    }

    let puffleId = args.puffle;
    let wellbeing = await this.db.getWellbeing(puffleId);

    if (wellbeing) {
      user.send('get_wellbeing', {
        puffleId: puffleId,
        clean: wellbeing.clean,
        food: wellbeing.food,
        play: wellbeing.play,
        rest: wellbeing.rest
      });
    }
  }

  async stopWalking(args, user) {
    if (user.data.walking !== 0) {
      user.data.walking = 0;
      user.update({
        walking: user.data.walking
      });
      user.room.send(user, 'stop_walking', {
        user: user.data.id
      }, []);
    }
  }

  async walkPuffle(args, user) {
    if (args.puffle !== 0) {
      user.data.walking = args.puffle;
      user.update({
        walking: user.data.walking
      });
      user.room.send(user, 'walk_puffle', {
        user: user.data.id,
        puffle: args.puffle
      }, []);
    }
  }

  async getPuffleColor(args, user) {
    if (!args.puffle) {
      return;
    }

    let puffleId = args.puffle;
    let puffleColor = await this.db.getPuffleColor(puffleId);

    if (puffleColor) {
      user.send('get_puffle_color', {
        penguinId: args.penguinId,
        color: puffleColor.color
      });
    }
  }

}

exports.default = Puffles;