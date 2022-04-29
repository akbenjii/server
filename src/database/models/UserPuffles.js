import Sequelize from 'sequelize'


export default class UserPuffles extends Sequelize.Model {

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
        })
    }

}
