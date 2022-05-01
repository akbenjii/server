"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Items extends _sequelize.default.Model {
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
      type: {
        type: DataTypes.INTEGER(6),
        allowNull: false
      },
      cost: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      member: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      bait: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      patched: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      treasure: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'items'
    });
  }

}

exports.default = Items;