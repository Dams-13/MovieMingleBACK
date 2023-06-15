const {
  addFavoriteMovieRepo,
  removeFavoriteMovieRepo,
  getFavoriteMoviesRepo,
  isMovieFavoritedByUserRepo,
} = require("../models/favorite-movie-repository");
const { validateBody } = require("./validation/route.validator");

exports.addFavoriteMovie = async (req, res) => {
  try {
    validateBody(req);
    const userId = req.auth.userId;
    const movieId = req.params.movieId;
    await addFavoriteMovieRepo(userId, movieId);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).send("Erreur lors de l'ajout du film favori");
  }
};

exports.removeFavoriteMovie = async (req, res) => {
  try {
    validateBody(req);
    const userId = req.auth.userId;
    const movieId = req.params.movieId;
    await removeFavoriteMovieRepo(userId, movieId);
    res
      .status(200)
      .json({ success: true, message: "Film supprimé avec succès" });
  } catch (error) {
    res.status(500).send("Erreur lors de la suppression du film favori");
  }
};

exports.getFavoriteMovies = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const favoriteMovies = await getFavoriteMoviesRepo(userId);
    res.json(favoriteMovies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.isMovieInFavorites = async (req, res) => {
  try {
    validateBody(req);
    const userId = req.auth.userId;
    const movieId = req.params.movieId;
    const isInFavorites = await isMovieFavoritedByUserRepo(userId, movieId);
    res.status(200).json({ isInFavorites: isInFavorites });
  } catch (error) {
    res.status(500).send("Erreur lors de la vérification du film favori");
  }
};
