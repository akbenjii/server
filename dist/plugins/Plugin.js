"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Plugin {
  constructor(handler) {
    this.handler = handler;
    this.db = handler.db;
    this.users = handler.users;
    this.usersById = handler.usersById;
    this.config = handler.config;
    this.crumbs = handler.crumbs;
    this.rooms = handler.rooms;
    this.openIgloos = handler.openIgloos;
    this.discord = handler.discord;
  }

  get plugins() {
    return this.handler.plugins.plugins;
  }

}

exports.default = Plugin;