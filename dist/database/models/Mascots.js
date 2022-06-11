"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Mascots extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      giveaway: {
        type: DataTypes.INTEGER(11)
      },
      stamp: {
        type: DataTypes.INTEGER(11)
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'mascots'
    });
  }

}

exports.default = Mascots;