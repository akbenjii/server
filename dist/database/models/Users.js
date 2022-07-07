"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Users extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(12),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      loginKey: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      rank: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      stealthMode: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      permaBan: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      joinTime: {
        type: _sequelize.default.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      coins: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      head: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      face: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      neck: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      body: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      hand: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      feet: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      color: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      photo: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      flag: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      username_approved: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      username_rejected: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      ip: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      messagesSent: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      snowballsThrown: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      timePlayed: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      sledRacesWon: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      findFourWon: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      coinsEarned: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      coinsSpent: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      partyTasksCompleted: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      hasBeenPOTW: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      stampbookColor: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      stampbookClasp: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      stampbookPattern: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      cannon_data: {
        type: DataTypes.STRING(1000)
      },
      walking: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'users'
    });
  }

}

exports.default = Users;