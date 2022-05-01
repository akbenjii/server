"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Waddles extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      roomId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      seats: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      game: {
        type: DataTypes.STRING(20),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'waddles'
    });
  }

}

exports.default = Waddles;