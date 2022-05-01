"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Buddies extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      buddyId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'buddies'
    });
  }

}

exports.default = Buddies;