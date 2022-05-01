"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Ignore extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'ignore_add': this.addIgnore,
      'ignore_remove': this.removeIgnore
    };
  }

  addIgnore(args, user) {
    if (user.data.id == args.id) return;
    if (user.buddy.includes(args.id)) return;
    if (user.ignore.includes(args.id)) return; // Remove any existing requests

    user.buddy.requests = user.buddy.requests.filter(item => item != args.id);
    let ignore = this.usersById[args.id];

    if (ignore) {
      ignore.buddy.requests = ignore.buddy.requests.filter(item => item != user.data.id);
    } // Add to ignore list


    user.ignore.addIgnore(args.id, args.username); // Db queries

    this.db.ignores.create({
      userId: user.data.id,
      ignoreId: args.id
    });
  }

  removeIgnore(args, user) {
    if (!user.ignore.includes(args.id)) return;
    user.ignore.removeIgnore(args.id);
    this.db.ignores.destroy({
      where: {
        userId: user.data.id,
        ignoreId: args.id
      }
    });
  }

}

exports.default = Ignore;