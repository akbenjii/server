"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Op = _sequelize.default.Op;

class Database {
  constructor(config) {
    this.sequelize = new _sequelize.default(config.database, config.user, config.password, {
      host: config.host,
      dialect: config.dialect,
      logging: config.debug ? console.log : false
    }); // Used to translate type id to string

    this.slots = ['color', 'head', 'face', 'neck', 'body', 'hand', 'feet', 'flag', 'photo', 'award'];
    this.dir = `${__dirname}/models`;
    this.loadModels();
    this.sequelize.authenticate().then(() => {// Connected
    }).catch(error => {
      console.error(`[Database] Unable to connect to the database: ${error}`);
    });
  }

  loadModels() {
    _fs.default.readdirSync(this.dir).forEach(model => {
      let modelImport = require(_path.default.join(this.dir, model)).default;

      let modelObject = modelImport.init(this.sequelize, _sequelize.default);
      let name = model.charAt(0).toLowerCase() + model.slice(1, -3);
      this[name] = modelObject;
    });
  }

  async getItems() {
    let items = await this.getCrumb('items');
    items.slots = this.slots;
    return items;
  }

  async getIgloos() {
    return await this.getCrumb('igloos');
  }

  async getFurnitures() {
    return await this.getCrumb('furnitures');
  }

  async getFloorings() {
    return await this.getCrumb('floorings');
  }

  async getRooms() {
    return await this.findAll('rooms', {
      raw: true
    });
  }

  async getWaddles() {
    return await this.findAll('waddles', {
      raw: true
    });
  }

  async getUserByUsername(username) {
    return await this.findOne('users', {
      where: {
        username: username
      }
    });
  }

  async getUserById(userId) {
    return await this.findOne('users', {
      where: {
        id: userId
      }
    });
  }

  async getAuthToken(userId, selector) {
    return await this.findOne('authTokens', {
      where: {
        userId: userId,
        selector: selector
      }
    });
  }

  async getActiveBan(userId) {
    let user = await this.findOne('users', {
      where: {
        id: userId
      }
    });
    let usersOnIp = await this.findAll('users', {
      where: {
        ip: user.dataValues.ip
      }
    });
    if (!user.dataValues.ip) usersOnIp = null;
    this.activeBansOnIp = [];
    this.longestBan = {};
    this.longestBan.dataValues = {};
    this.longestBan.dataValues.expires = 0;

    for (var x in usersOnIp) {
      var ban = await this.findOne('bans', {
        where: {
          userId: usersOnIp[x].dataValues.id,
          expires: {
            [Op.gt]: Date.now()
          }
        }
      });
      if (ban) this.activeBansOnIp.push(ban);
    }

    var ban = await this.findOne('bans', {
      where: {
        userId: userId,
        expires: {
          [Op.gt]: Date.now()
        }
      }
    });
    if (ban) this.activeBansOnIp.push(ban);

    for (var x in this.activeBansOnIp) {
      var expirationDate = Date.parse(this.activeBansOnIp[x].dataValues.expires);
      var longestExpirationDate = Date.parse(this.longestBan.dataValues.expires);
      if (expirationDate > longestExpirationDate) this.longestBan = this.activeBansOnIp[x];
    }

    if (this.longestBan.dataValues.expires == 0) return;
    return this.longestBan;
  }

  async getBanCount(userId) {
    return await this.bans.count({
      where: {
        userId: userId
      }
    });
  }

  async getBuddies(userId) {
    return await this.findAll('buddies', {
      where: {
        userId: userId
      },
      attributes: ['buddyId']
    }, [], result => {
      return result.map(result => result.buddyId);
    });
  }

  async getIgnores(userId) {
    return await this.findAll('ignores', {
      where: {
        userId: userId
      },
      attributes: ['ignoreId']
    }, [], result => {
      return result.map(result => result.ignoreId);
    });
  }

  async getInventory(userId) {
    return await this.findAll('inventories', {
      where: {
        userId: userId
      },
      attributes: ['itemId']
    }, [], result => {
      return result.map(result => result.itemId);
    });
  }

  async getIglooInventory(userId) {
    return await this.findAll('iglooInventories', {
      where: {
        userId: userId
      },
      attributes: ['iglooId']
    }, [], result => {
      return result.map(result => result.iglooId);
    });
  }

  async getFurnitureInventory(userId) {
    return await this.findAll('furnitureInventories', {
      where: {
        userId: userId
      },
      attributes: ['itemId', 'quantity'],
      raw: true
    }, {}, result => {
      return this.arrayToObject(result, 'itemId', 'quantity');
    });
  }

  async getIgloo(userId) {
    return await this.findOne('userIgloos', {
      where: {
        userId: userId
      },
      raw: true
    }, null, async result => {
      // Add furniture to igloo object
      result.furniture = await this.getUserFurnitures(userId);
      return result;
    });
  }

  async getUserFurnitures(userId) {
    return await this.findAll('userFurnitures', {
      where: {
        userId: userId
      },
      raw: true
    }, [], result => {
      // Removes user id from all objects in furniture array
      return result.map(({
        userId,
        ...furnitures
      }) => furnitures);
    });
  }

  async getWorldPopulations() {
    return await this.getCrumb('worlds');
  }

  async getUnverifedUsers(userId) {
    return await this.findAll('users', {
      where: {
        username_approved: "0",
        username_rejected: "0"
      }
    });
  }

  async searchForUsers(username) {
    let exactMatch = await this.findOne('users', {
      where: {
        username: username
      }
    });
    let closeMatch = await this.findAll('users', {
      where: {
        username: {
          [Op.like]: '%' + username + '%'
        }
      }
    });

    if (!exactMatch) {
      return closeMatch;
    } else {
      for (var i = closeMatch.length - 1; i >= 0; i--) {
        if (closeMatch[i].username === exactMatch.username) {
          closeMatch.splice(i, 1);
        }
      }

      closeMatch.unshift(exactMatch);
      return closeMatch;
    }
  }

  async addCoins(userID, coins) {
    let user = await this.getUserById(userID);
    this.users.update({
      coins: parseInt(user.dataValues.coins) + parseInt(coins)
    }, {
      where: {
        id: userID
      }
    });
  }

  async addItem(userID, item) {
    var inventory = await this.getInventory(userID);
    var checkItem = await this.findOne('items', {
      where: {
        id: item
      }
    }); // A user having 2 of the same items would probably cause some issues

    if (inventory.includes(item)) {
      return;
    } // If an item that doesn't exist is added to a user, the game will crash on load


    if (!checkItem) {
      return;
    }

    this.inventories.create({
      userId: userID,
      itemId: item
    });
    return true;
  }

  async ban(userId, banDuration, modId) {
    this.bans.create({
      userId: userId,
      expires: banDuration,
      moderatorId: modId
    });
  }

  async changeUsername(userId, newUsername) {
    if (newUsername.length < 4) return false;
    if (newUsername.length > 16) return false;
    let existingUser = await this.getUserByUsername(newUsername);
    if (existingUser) return false;
    this.users.update({
      username: newUsername
    }, {
      where: {
        id: userId
      }
    });
    return true;
  }

  async updatePassword(userId, password) {
    if (password.length < 5) return false;
    if (password.length > 32) return false;
    let hash = await bcrypt.hash(password, 10);
    this.users.update({
      password: hash
    }, {
      where: {
        id: userId
      }
    });
    return true;
  }

  async getPuffles(userId) {
    return await this.findAll('userPuffles', {
      where: {
        userId: userId
      },
      attributes: ['id', 'color', 'name']
    });
  }

  async getWellbeing(puffleId) {
    return await this.findOne('userPuffles', {
      where: {
        id: puffleId
      },
      attributes: ['food', 'play', 'rest', 'clean']
    });
  }
  /*========== Helper functions ==========*/


  findOne(table, options = {}, emptyReturn = null, callback = null) {
    return this.find('findOne', table, options, emptyReturn, callback);
  }

  findAll(table, options = {}, emptyReturn = null, callback = null) {
    return this.find('findAll', table, options, emptyReturn, callback);
  }

  find(find, table, options, emptyReturn, callback) {
    return this[table][find](options).then(result => {
      if (callback && result) {
        return callback(result);
      } else if (result) {
        return result;
      } else {
        return emptyReturn;
      }
    });
  }

  async getCrumb(table) {
    return await this.findAll(table, {
      raw: true
    }, {}, result => {
      return this.arrayToObject(result, 'id');
    });
  }

  arrayToObject(array, key, value = null) {
    return array.reduce((obj, item) => {
      // If a value is passed in then the key will be mapped to item[value]
      let result = value ? item[value] : item;
      obj[item[key]] = result;
      delete item[key];
      return obj;
    }, {});
  }

}

exports.default = Database;