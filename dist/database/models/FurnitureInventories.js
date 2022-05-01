"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FurnitureInventories extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      itemId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'furniture_inventories'
    });
  }

}

exports.default = FurnitureInventories;