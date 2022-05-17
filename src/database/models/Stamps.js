import Sequelize from 'sequelize'


export default class Stamps extends Sequelize.Model {

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
                },
            },
            { sequelize, timestamps: false, tableName: 'stamps' }
        )
    }

}
