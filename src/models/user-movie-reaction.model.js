const { DataTypes } = require('sequelize');
const { sequelize } = require('./postgres.db');

const UserMovieReaction = sequelize.define(
  'UserMovieReaction',
  {
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: 'user', key: 'id' } },
    movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'movies', key: 'id' } },
    reaction: { type: DataTypes.ENUM('like', 'dislike'), allowNull: false },
  },
  {
    tableName: 'user_movie_reactions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'movieId'],
      },
    ],
  },
);

module.exports = UserMovieReaction;