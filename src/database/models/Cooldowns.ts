import { Sequelize, DataTypes } from 'sequelize';

export default function Cooldowns(sq: Sequelize) {
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