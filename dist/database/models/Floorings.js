"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Floorings extends _sequelize.default.Model {
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
      cost: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 0
      },
      patched: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'floorings'
    });
  }

}

exports.default = Floorings;