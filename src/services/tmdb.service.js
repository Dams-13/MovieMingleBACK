const axios = require('axios');

const apiKey = process.env.TMDB_API_KEY;
const apiUrl = 'https://api.themoviedb.org/3';
const language = 'fr-FR';

exports.getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${apiUrl}/movie/${movieId}`, {
      params: {
        api_key: apiKey,
        language: language,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

exports.getPopularMovies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
        language: language,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

exports.getPopularMoviesPages = async (pagesCount) => {
  try {
    const popularMovies = [];

    for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
      const response = await axios.get(`${apiUrl}/movie/popular`, {
        params: {
          api_key: apiKey,
          language: language,
          page: pageNumber,
        },
      });
      popularMovies.push(...response.data.results);
    }

    return popularMovies;
  } catch (error) {
    console.error('Error fetching popular movies pages:', error);
    throw error;
  }
};