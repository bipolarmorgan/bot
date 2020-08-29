import { Sequelize, DataTypes } from 'sequelize';

export default function Texts(sq: Sequelize) {
    return sq.define('texts', {
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