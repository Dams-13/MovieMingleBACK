const FavoriteMovie = require("./favorite-movie.model");
const Movie = require("./movie.model");

exports.addFavoriteMovieRepo = async (userId, movieId) => {
  try {
    const favoriteMovie = await FavoriteMovie.create({ userId, movieId });
    return favoriteMovie;
  } catch (error) {
    throw error;
  }
};

exports.removeFavoriteMovieRepo = async (userId, movieId) => {
  try {
    const result = await FavoriteMovie.destroy({ where: { userId, movieId } });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getFavoriteMoviesRepo = async (userId) => {
  try {
    const favoriteMovies = await FavoriteMovie.findAll({
      where: { userId },
      include: [
        {
          model: Movie,
          as: "movie",
        },
      ],
    });
    return favoriteMovies.map((favorite) => favorite.movie);
  } catch (error) {
    throw new Error("Error fetching favorite movies: " + error.message);
  }
};

exports.isMovieFavoritedByUserRepo = async (userId, movieId) => {
  try {
    const favoriteMovie = await FavoriteMovie.findOne({
      where: { userId, movieId },
    });
    return favoriteMovie !== null;
  } catch (error) {
    throw error;
  }
};
