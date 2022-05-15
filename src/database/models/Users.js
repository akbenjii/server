import Sequelize from 'sequelize'


export default class Users extends Sequelize.Model {

    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                username: {
                    type: DataTypes.STRING(12),
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING(60),
                    allowNull: false
                },
                loginKey: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                rank: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                stealthMode: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                permaBan: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                joinTime: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
                },
                coins: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                head: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                face: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                neck: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                body: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                hand: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                feet: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                color: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                photo: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                flag: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                username_approved: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                username_rejected: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
                ip: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                messagesSent: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                snowballsThrown: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                timePlayed: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                sledRacesWon: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                findFourWon: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                coinsEarned: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                coinsSpent: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                partyTasksCompleted: {
                    type: DataTypes.INTEGER(11),
                    allowNull: false
                },
                hasBeenPOTW: {
                    type: DataTypes.INTEGER(1),
                    allowNull: false
                },
            },
            { sequelize, timestamps: false, tableName: 'users' }
        )
    }

}
