const { DataTypes } = require('sequelize');
const { sequelize } = require('./postgres.db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: 'user' },
);

module.exports = User;
