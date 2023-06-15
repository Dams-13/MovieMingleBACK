const express = require("express");
const router = express.Router();
const guard = require("express-jwt-permissions")({
  requestProperty: "auth",
});
const {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  savePopularMovies,
  saveAllPopularMovies,
  getSavedMovies,
  getMoviesByGenres,
  likeMovie,
  dislikeMovie,
  getVotePercentage,
  getUserVote,
  removeVote,
  updateMovie,
  deleteMovie,
} = require("../movie.controller");

router.get("/search", searchMovies);
router.get("/:movieId/details", getMovieDetails);
router.get("/popular", guard.check("admin"), getPopularMovies);
router.post("/save-popular", guard.check("admin"), savePopularMovies);
router.post("/save-popularall", guard.check("admin"), saveAllPopularMovies);
router.get("/movie", getSavedMovies);
router.get("/by-genres", getMoviesByGenres);

router.post("/:id/like", likeMovie);
router.post("/:id/dislike", dislikeMovie);
router.get("/:id/vote", getVotePercentage);
router.get("/:id/uservote", getUserVote);
router.delete("/:id/vote", removeVote);

router.put("/:movieId", guard.check("admin"), updateMovie);
router.delete("/:movieId", guard.check("admin"), deleteMovie);

exports.initializeRoutes = () => router;
