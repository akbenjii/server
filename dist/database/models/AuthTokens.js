"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthTokens extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      selector: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true
      },
      validator: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      timestamp: {
        type: _sequelize.default.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'auth_tokens'
    });
  }

}

exports.default = AuthTokens;