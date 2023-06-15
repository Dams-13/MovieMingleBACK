const { DataTypes } = require('sequelize');
const { sequelize } = require('./postgres.db');

const Comment = sequelize.define(
  'Comment',
  {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    movieId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'comments' },
);

module.exports = Comment;
