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
      'walk_puffle': this.walkPuffle,
      'get_puffle_count': this.getPuffleCount
    };
  }

  async adoptPuffle(args, user) {
    let type = args.type;
    let name = args.name.charAt(0).toUpperCase() + args.name.slice(1);
    let cost = (await this.db.getPuffleCost(type)).dataValues.cost;

    if (cost > user.data.coins) {
      user.send('error', {
        error: 'You need more coins.'
      });
      return;
    }

    user.updateCoins(-cost);
    let puffle = await this.db.adoptPuffle(user.data.id, type, name);
    user.send('adopt_puffle', {
      puffle: puffle.id,
      coins: user.data.coins
    });
    let postcard = await this.db.userPostcards.create({
      userId: user.data.id,
      id: 111,
      sender: "Club Penguin Forever",
      details: name
    });

    if (postcard) {
      user.postcards = await this.db.getPostcards(user.data.id);
      user.send('update_postcards', {
        postcards: user.postcards
      });
    }
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
        rest: wellbeing.rest,
        name: wellbeing.name
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

  async getPuffleCount(args, user) {
    if (!user.data.id) {
      return;
    }

    let puffleCount = await this.db.getPuffleCount(user.data.id);

    if (puffleCount) {
      user.send('get_puffle_count', {
        count: puffleCount
      });
    }
  }

}

exports.default = Puffles;