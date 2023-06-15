const User = require("./user.model");
const Movie = require("./movie.model");
const Comment = require("./comment.model");
const FavoriteMovie = require("./favorite-movie.model");
const UserMovieReaction = require("./user-movie-reaction.model");

const setupAssociations = () => {
  // Associations pour Comment
  Comment.belongsTo(User, { foreignKey: "userId", as: "author" });
  Comment.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

  // Ajout de l'association pour firstName
  User.hasMany(Comment, { foreignKey: "userId", as: "userComments" });
  Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Associations inverses pour faciliter les requêtes
  User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

  Movie.hasMany(Comment, { foreignKey: "movieId", as: "comments" });

  // Associations pour FavoriteMovie
  FavoriteMovie.belongsTo(User, { foreignKey: "userId", as: "user" });
  FavoriteMovie.belongsTo(Movie, { foreignKey: "movieId", as: "movie" });

  // Associations inverses pour faciliter les requêtes
  User.hasMany(FavoriteMovie, { foreignKey: "userId", as: "favoriteMovies" });
  Movie.hasMany(FavoriteMovie, { foreignKey: "movieId", as: "favoritedBy" });

  User.hasMany(UserMovieReaction, { foreignKey: "userId" });
  Movie.hasMany(UserMovieReaction, { foreignKey: "movieId" });
  UserMovieReaction.belongsTo(User, { foreignKey: "userId" });
  UserMovieReaction.belongsTo(Movie, { foreignKey: "movieId" });
};

module.exports = setupAssociations;