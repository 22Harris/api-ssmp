const { DataTypes } = require('sequelize');
const sequelize = require('../../../configs/sequelize');

const Medication = sequelize.define('Medication', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'medications',
    timestamps: true,
});

module.exports = Medication;
