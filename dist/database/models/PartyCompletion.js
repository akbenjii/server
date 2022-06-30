"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PartyCompletion extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      penguinId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      party: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      info: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      value: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'party_completion'
    });
  }

}

exports.default = PartyCompletion;