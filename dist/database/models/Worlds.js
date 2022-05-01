"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Worlds extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.STRING(3),
        allowNull: false,
        primaryKey: true
      },
      population: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        defaultvalue: 0
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'worlds'
    });
  }

}

exports.default = Worlds;