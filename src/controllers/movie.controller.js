const {
  getMovieDetails,
  getPopularMovies,
  getPopularMoviesPages,
} = require("../services/tmdb.service");

const {
  saveMoviesRepo,
  searchMoviesRepo,
  getMoviesRepo,
  getMoviesByGenresRepo,
  getTotalMoviesRepo,
  updateMovieRepo,
  deleteMovieRepo,
} = require("../models/movie.repository");

const {
  setUserMovieReactionRepo,
  getUserMovieReactionRepo,
  getMovieReactionsSummaryRepo,
  getReactionPercentagesRepo,
  removeUserMovieReactionRepo,
} = require("../models/user-movie-reaction-repository");

exports.searchMovies = async (req, res) => {
  try {
    const query = req.query.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const movies = await searchMoviesRepo(query, page, pageSize);

    res.json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).send("Error searching movies");
  }
};

exports.getMovieDetails = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const movieDetails = await getMovieDetails(movieId);
    res.json(movieDetails);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).send("Error fetching movie details");
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const popularMovies = await getPopularMovies();
    res.json(popularMovies);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).send("Error fetching popular movies");
  }
};

exports.savePopularMovies = async (req, res) => {
  try {
    const popularMovies = await getPopularMovies();
    const savedMovies = await saveMoviesRepo(popularMovies.results);
    res.json(savedMovies);
  } catch (error) {
    console.error("Error saving popular movies:", error);
    res.status(500).send("Error saving popular movies");
  }
};

exports.saveAllPopularMovies = async (req, res) => {
  try {
    const pagesCount = req.body.pagesCount || 1; // valeur par défaut pour le nombre de pages à récupérer
    const popularMovies = await getPopularMoviesPages(pagesCount);
    const savedMovies = await saveMoviesRepo(popularMovies);
    res.json(savedMovies);
  } catch (error) {
    console.error("Error saving all popular movies:", error);
    res.status(500).send("Error saving all popular movies");
  }
};

exports.getSavedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const movies = await getMoviesRepo(page, pageSize);
    const totalMovies = await getTotalMoviesRepo();

    res.json({ movies, totalMovies });
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    res.status(500).send("Error fetching saved movies");
  }
};

exports.getMoviesByGenres = async (req, res) => {
  try {
    const genreIds = req.query.genreIds.split(",").map(Number);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    console.log("Received genreIds:", genreIds);
    const movies = await getMoviesByGenresRepo(genreIds, page, pageSize);
    console.log("Movies fetched by genres:", movies);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies by genres:", error);
    res.status(500).send("Error fetching movies by genres");
  }
};

exports.likeMovie = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const movieId = parseInt(req.params.id);

    await setUserMovieReactionRepo(userId, movieId, "like");

    const { likesCount, dislikesCount } = await getMovieReactionsSummaryRepo(
      movieId
    );
    const votePercentage = await getReactionPercentagesRepo(movieId);

    res.json({ likesCount, dislikesCount, votePercentage });
  } catch (error) {
    console.error("Error liking movie:", error);
    res.status(500).send("Error liking movie");
  }
};

exports.dislikeMovie = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const movieId = parseInt(req.params.id);

    await setUserMovieReactionRepo(userId, movieId, "dislike");

    const { likesCount, dislikesCount } = await getMovieReactionsSummaryRepo(
      movieId
    );
    const votePercentage = await getReactionPercentagesRepo(movieId);

    res.json({ likesCount, dislikesCount, votePercentage });
  } catch (error) {
    console.error("Error disliking movie:", error);
    res.status(500).send("Error disliking movie");
  }
};

exports.getVotePercentage = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);

    const votePercentage = await getReactionPercentagesRepo(movieId);

    res.json({ votePercentage });
  } catch (error) {
    console.error("Error fetching vote percentage:", error);
    res.status(500).send("Error fetching vote percentage");
  }
};

exports.getUserVote = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const movieId = parseInt(req.params.id);

    const userMovieReaction = await getUserMovieReactionRepo(userId, movieId);
    const userVote = userMovieReaction ? userMovieReaction.reaction : null;

    res.json({ userVote });
  } catch (error) {
    console.error("Error fetching user vote:", error);
    res.status(500).send("Error fetching user vote");
  }
};

exports.removeVote = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const movieId = parseInt(req.params.id);

    await removeUserMovieReactionRepo(userId, movieId);

    const { likesCount, dislikesCount } = await getMovieReactionsSummaryRepo(
      movieId
    );
    const votePercentage = await getReactionPercentagesRepo(movieId);

    res.json({ likesCount, dislikesCount, votePercentage });
  } catch (error) {
    console.error("Error removing vote:", error);
    res.status(500).send("Error removing vote");
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movieData = req.body;

    const updatedMovie = await updateMovieRepo(movieId, movieData);
    res.json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).send("Error updating movie");
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;

    await deleteMovieRepo(movieId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).send("Error deleting movie");
  }
};
