import Sequelize from 'sequelize'


export default class Mascots extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false
                },
                giveaway: {
                    type: DataTypes.INTEGER(11)
                },
                stamp: {
                    type: DataTypes.INTEGER(11)
                }
            },
            { sequelize, timestamps: false, tableName: 'mascots' }
        )
    }

}
