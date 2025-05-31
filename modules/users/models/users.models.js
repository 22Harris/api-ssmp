const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ← ici on importe l'instance Sequelize

const User = sequelize.define('User', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Le mot de passe doit contenir au moins 6 caractères.',
      },
    },
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
