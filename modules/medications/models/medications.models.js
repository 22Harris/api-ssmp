const { DataTypes } = require('sequelize');
const sequelize = require('../../../configs/sequelize');

const Medication = sequelize.define('Medication', {
    ID: {
        type: DataTypes.STRING,
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
        default: null,
    }
}, {
    tableName: 'Medication',
    timestamps: false,
});

module.exports = Medication;