"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserPuffles extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      color: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      food: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 100
      },
      play: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 100
      },
      rest: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 100
      },
      clean: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 100
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'user_puffles'
    });
  }

}

exports.default = UserPuffles;