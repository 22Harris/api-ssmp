const { DataTypes } = require('sequelize');
const sequelize = require('../../../configs/sequelize');

const Historics = sequelize.define('Historics', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  dateDeliver: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nameMedication: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeMedication: {
    type: DataTypes.STRING,
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
  medicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'historics',
  timestamps: true,
});

module.exports = Historics;
