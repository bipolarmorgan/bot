const { DataTypes } = require('sequelize');

/**
 * 
 * @param {import('sequelize').Sequelize} sq 
 */
function Tickets(sq) {
    return sq.define('tickets', {
        guild_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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

module.exports = Tickets;