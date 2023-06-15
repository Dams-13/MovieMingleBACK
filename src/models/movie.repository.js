const Movie = require("./movie.model");
const { Op } = require("sequelize");

exports.saveMoviesRepo = async (movies) => {
  return await Movie.bulkCreate(movies, {
    updateOnDuplicate: [
      "title",
      "overview",
      "poster_path",
      "genre_ids",
      "backdrop_path",
      "release_date",
    ],
  });
};

exports.getMoviesRepo = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    const result = await Movie.findAndCountAll({
      offset: offset,
      limit: pageSize,
    });

    return {
      movies: result.rows,
      count: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching saved movies with pagination:", error);
    throw error;
  }
};

exports.getTotalMoviesRepo = async () => {
  try {
    const totalMovies = await Movie.count();
    return totalMovies;
  } catch (error) {
    console.error("Error fetching total movies count:", error);
    throw error;
  }
};

exports.searchMoviesRepo = async (query, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    const result = await Movie.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${query}%`,
        },
      },
      offset: offset,
      limit: pageSize,
    });

    return {
      movies: result.rows,
      count: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error searching movies with pagination:", error);
    throw error;
  }
};

//Op.contains : renvoie les films dont les genres incluent tous les genres spécifiés dans genreIds.
exports.getMoviesByGenresRepo = async (genreIds, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;

    const result = await Movie.findAndCountAll({
      where: {
        genre_ids: {
          [Op.contains]: genreIds,
        },
      },
      offset: offset,
      limit: pageSize,
    });

    return {
      movies: result.rows,
      count: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching movies by genres with pagination:", error);
    throw error;
  }
};

exports.updateMovieRepo = async (movieId, movieData) => {
  try {
    await Movie.update(movieData, { where: { id: movieId } });
    const updatedMovie = await Movie.findByPk(movieId);
    return updatedMovie;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

exports.deleteMovieRepo = async (movieId) => {
  try {
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      throw new Error("Movie not found");
    }
    await movie.destroy();
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

//Op.any : renvoie les films ayant au moins un genre correspondant à ceux spécifiés dans genreIds.
/*exports.getMoviesByGenres = async (genreIds) => {
  try {
    const movies = await Movie.findAll({
      where: {
        genre_ids: {
          [Op.any]: genreIds,
        },
      },
    });

    return movies;
  } catch (error) {
    console.error("Error fetching movies by genres:", error);
    throw error;
  }
};*/

//Op.overlap : renvoie les films ayant au moins un genre en commun avec ceux spécifiés dans genreIds.
/*exports.getMoviesByGenres = async (genreIds) => {
  try {
    console.log("getMoviesByGenres received genreIds:", genreIds);
    const movies = await Movie.findAll({
      where: {
        genre_ids: {
          [Op.overlap]: genreIds,
        },
      },
    });

    return movies;
  } catch (error) {
    console.error("Error fetching movies by genres:", error);
    throw error;
  }
};*/

//Avec console log
/*exports.getMoviesByGenres = async (genreIds) => {
  try {
    console.log("getMoviesByGenres received genreIds:", genreIds);
    const movies = await Movie.findAll({
      where: {
        genre_ids: {
          [Op.overlap]: genreIds,
        },
      },
    });

    return movies;
  } catch (error) {
    console.error("Error fetching movies by genres:", error);
    throw error;
  }
};*/
