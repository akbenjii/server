"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _crypto = _interopRequireDefault(require("crypto"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _uuid = require("uuid");

var _Plugin = _interopRequireDefault(require("../Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameAuth extends _Plugin.default {
  constructor(users, rooms) {
    super(users, rooms);
    this.events = {
      'game_auth': this.gameAuth
    };
  } // Events


  async gameAuth(args, user) {
    // Already authenticated
    if (user.authenticated) {
      return;
    }

    let userData = await user.db.getUserByUsername(args.username);

    if (!userData) {
      return user.close();
    }

    user.data = userData; // Full server

    if (this.handler.population > this.handler.maxUsers && !user.isModerator) {
      return user.close();
    } // Check banned


    let activeBan = await user.db.getActiveBan(user.data.id);

    if (activeBan || user.data.permaBan) {
      return user.close();
    }

    this.compareLoginKey(args, user);
  } // Functions


  async compareLoginKey(args, user) {
    let decoded;
    let token; // Verify JWT

    try {
      decoded = _jsonwebtoken.default.verify(user.data.loginKey, this.config.crypto.secret);
    } catch (err) {
      return user.close();
    } // Verify hash


    let address = user.socket.handshake.address;
    let userAgent = user.socket.request.headers['user-agent'];
    let match = await _bcrypt.default.compare(`${user.data.username}${args.key}${address}${userAgent}`, decoded.hash);

    if (!match) {
      return user.close();
    } // Remove login key from database


    user.update({
      loginKey: null
    }); // Create new token

    if (args.createToken) {
      token = await this.genAuthToken(user);
    } // Disconnect if already logged in


    if (user.data.id in this.usersById) {
      this.usersById[user.data.id].close();
    } // Success


    this.usersById[user.data.id] = user;
    await this.discord.logLogin(user.data.username);
    await user.setBuddies(await user.db.getBuddies(user.data.id));
    await user.setIgnores(await user.db.getIgnores(user.data.id));
    user.setInventory(await user.db.getInventory(user.data.id));
    user.setIglooInventory(await user.db.getIglooInventory(user.data.id));
    user.setFurnitureInventory(await user.db.getFurnitureInventory(user.data.id));
    user.authenticated = true; // Send response

    user.send('game_auth', {
      success: true
    });

    if (token) {
      user.send('auth_token', {
        token: token
      });
    } // Update world population


    await this.handler.updateWorldPopulation();
  }

  async genAuthToken(user) {
    let userData = await this.db.getUserById(user.data.id);
    let validator = userData.password;
    let selector = userData.username;
    return `${selector}:${validator}`;
  }

}

exports.default = GameAuth;