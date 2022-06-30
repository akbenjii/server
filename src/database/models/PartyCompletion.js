import Sequelize from 'sequelize'


export default class PartyCompletion extends Sequelize.Model {

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
        })
    }

}
