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
        allowNull: false
      },
      play: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      rest: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      clean: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'user_puffles'
    });
  }

}

exports.default = UserPuffles;