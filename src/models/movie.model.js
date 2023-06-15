const { DataTypes } = require('sequelize');
const { sequelize } = require('./postgres.db');

const Movie = sequelize.define(
  'Movie',
  {
    id: { primaryKey: true, type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    overview: { type: DataTypes.TEXT, allowNull: true },
    genre_ids: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true },
    backdrop_path: { type: DataTypes.STRING, allowNull: true },
    poster_path: { type: DataTypes.STRING, allowNull: true },
    release_date: { type: DataTypes.DATE, allowNull: true },
    likes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    dislikes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'movies' },
);

module.exports = Movie;