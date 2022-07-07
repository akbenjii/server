"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserPostcards extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      sender: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      time_sent: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      details: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'user_postcards'
    });
  }

}

exports.default = UserPostcards;