const UserMovieReaction = require("./user-movie-reaction.model");
const Movie = require("./movie.model");

exports.setUserMovieReactionRepo = async (userId, movieId, reaction) => {
  try {
    const existingUserMovieReaction = await UserMovieReaction.findOne({
      where: { userId, movieId },
    });

    if (existingUserMovieReaction) {
      await UserMovieReaction.update(
        { reaction },
        { where: { userId, movieId } }
      );
    } else {
      await UserMovieReaction.create({ userId, movieId, reaction });
    }
  } catch (error) {
    throw error;
  }
};

exports.getUserMovieReactionRepo = async (userId, movieId) => {
  try {
    const userMovieReaction = await UserMovieReaction.findOne({
      where: { userId, movieId },
    });
    return userMovieReaction;
  } catch (error) {
    throw error;
  }
};

exports.getMovieReactionsSummaryRepo = async (movieId) => {
  try {
    const likesCount = await UserMovieReaction.count({
      where: { movieId, reaction: "like" },
    });

    const dislikesCount = await UserMovieReaction.count({
      where: { movieId, reaction: "dislike" },
    });

    return { likesCount, dislikesCount };
  } catch (error) {
    throw new Error("Error fetching movie reactions summary: " + error.message);
  }
};

exports.getReactionPercentagesRepo = async (movieId) => {
  const likesCount = await UserMovieReaction.count({
    where: { movieId: movieId, reaction: "like" },
  });
  const dislikesCount = await UserMovieReaction.count({
    where: { movieId: movieId, reaction: "dislike" },
  });

  const totalReactions = likesCount + dislikesCount;

  if (totalReactions > 0) {
    const votePercentage = (likesCount / totalReactions) * 100;
    return votePercentage;
  } else {
    return 0;
  }
};

exports.removeUserMovieReactionRepo = async (userId, movieId) => {
  try {
    await UserMovieReaction.destroy({
      where: { userId, movieId },
    });
  } catch (error) {
    throw error;
  }
};
