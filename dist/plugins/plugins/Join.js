"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

var _Igloo = _interopRequireDefault(require("../../objects/room/Igloo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Join extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'load_player': this.loadPlayer,
      'join_server': this.joinServer,
      'join_room': this.joinRoom,
      'join_igloo': this.joinIgloo
    };
  } // Events


  loadPlayer(args, user) {
    user.room = this.getRandomSpawn();
    user.send('load_player', {
      user: user.string,
      room: user.room.id,
      joinTime: user.data.joinTime,
      stampbookClasp: user.data.stampbookClasp,
      stampbookColor: user.data.stampbookColor,
      stampbookPattern: user.data.stampbookPattern,
      cannonData: user.data.cannon_data,
      buddies: user.buddy.list,
      ignores: user.ignore.list,
      inventory: user.inventory.list,
      igloos: user.iglooInventory.list,
      furniture: user.furnitureInventory.list,
      stamps: user.stamps.list
    });
  }

  joinServer(args, user) {
    user.room.add(user);
  } // Limit this to 1/2 uses per second


  joinRoom(args, user) {
    user.joinRoom(this.rooms[args.room], args.x, args.y);
  }

  async joinIgloo(args, user) {
    let igloo = await this.getIgloo(args.igloo);
    user.joinRoom(igloo, args.x, args.y);
  } // Functions


  getRandomSpawn() {
    let spawns = Object.values(this.rooms).filter(room => room.spawn && !room.isFull); // All spawns full

    if (!spawns.length) {
      spawns = Object.values(this.rooms).filter(room => !room.game && !room.isFull);
    }

    return spawns[Math.floor(Math.random() * spawns.length)];
  }

  async getIgloo(id) {
    let internalId = id + this.config.game.iglooIdOffset; // Ensures igloos are above all default rooms

    if (!(internalId in this.rooms)) {
      let igloo = await this.db.getIgloo(id);
      if (!igloo) return null;
      this.rooms[internalId] = new _Igloo.default(igloo, this.db, this.config.game.iglooIdOffset);
    }

    return this.rooms[internalId];
  }

}

exports.default = Join;