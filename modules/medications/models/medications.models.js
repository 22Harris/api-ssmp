const { DataTypes } = require('sequelize');
const sequelize = require('../../../configs/sequelize');

const Medication = sequelize.define('Medication', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    arrivalDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: null,
    }
}, {
    tableName: 'medications',
    timestamps: true,
});

module.exports = Medication;