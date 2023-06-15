const express = require("express");
const router = express.Router();
const {
  addFavoriteMovie,
  removeFavoriteMovie,
  getFavoriteMovies,
  isMovieInFavorites,
} = require("../favorite-movie.controller");
const { param } = require("express-validator");

router.get("/", getFavoriteMovies);
router.post("/:movieId", [param("movieId").notEmpty().isInt()], addFavoriteMovie);
router.delete("/:movieId", [param("movieId").notEmpty().isInt()], removeFavoriteMovie);
router.get("/:movieId", [param("movieId").notEmpty().isInt()], isMovieInFavorites);

exports.initializeRoutes = () => router;
