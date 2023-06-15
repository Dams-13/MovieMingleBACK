const { DataTypes } = require('sequelize');
const { sequelize } = require('./postgres.db');
const User = require('./user.model');
const Movie = require('./movie.model');

const FavoriteMovie = sequelize.define(
  'FavoriteMovie',
  {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' }},
    movieId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Movie, key: 'id' }},
  },
  { tableName: 'favorite_movies' },
);

module.exports = FavoriteMovie;
