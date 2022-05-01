"use strict";

var _Database = _interopRequireDefault(require("./database/Database"));

var _DataHandler = _interopRequireDefault(require("./handlers/DataHandler"));

var _LoginHandler = _interopRequireDefault(require("./handlers/LoginHandler"));

var _Server = _interopRequireDefault(require("./server/Server"));

var _Discord = _interopRequireDefault(require("./logging/Discord"));

var _config = _interopRequireDefault(require("../config/config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class World extends _Server.default {
  constructor(id) {
    let users = {};
    let db = new _Database.default(_config.default.database);
    let discord = new _Discord.default(_config.default);
    let handler = id == 'Login' ? _LoginHandler.default : _DataHandler.default;
    handler = new handler(id, users, db, _config.default, discord);
    super(id, users, db, handler, _config.default);
  }

}

let args = process.argv.slice(2);

for (let world of args) {
  if (world in _config.default.worlds) {
    new World(world);
  }
}