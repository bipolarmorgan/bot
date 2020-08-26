const { DataTypes } = require('sequelize');

/**
 * 
 * @param {import('sequelize').Sequelize} sq 
 */
function Cooldowns(sq) {
    return sq.define('cooldowns', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },
        data: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        }
    }, {
        timestamps: false,
    });
}

module.exports = Cooldowns;