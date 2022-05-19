"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stamps extends _sequelize.default.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      groupid: {
        type: DataTypes.INTEGER(6),
        allowNull: false
      },
      difficulty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      tableName: 'stamps'
    });
  }

}

exports.default = Stamps;