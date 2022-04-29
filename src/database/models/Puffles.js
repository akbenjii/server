import Sequelize from 'sequelize'


export default class Puffles extends Sequelize.Model {

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
            cost: {
                type: DataTypes.INTEGER(11),
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: false,
            tableName: 'puffles'
        })
    }

}
