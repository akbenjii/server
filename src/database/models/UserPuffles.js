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
        })
    }

}
