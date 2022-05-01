"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserIgloos extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      type: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      flooring: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      music: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      location: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'user_igloos'
    });
  }

}

exports.default = UserIgloos;