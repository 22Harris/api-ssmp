const { DataTypes } = require('sequelize');
const sequelize = require('../../../configs/sequelize');

const Historics = sequelize.define('Historics', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  medicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dateDeliver: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  statusHistoric: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantityMedication: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'historics',
  timestamps: true,
});

module.exports = Historics;
