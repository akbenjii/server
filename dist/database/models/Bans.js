"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bans extends _sequelize.default.Model {
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
      issued: {
        type: _sequelize.default.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      expires: {
        type: _sequelize.default.DATE,
        allowNull: false
      },
      moderatorId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      message: {
        type: DataTypes.STRING(60),
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'bans'
    });
  }

}

exports.default = Bans;