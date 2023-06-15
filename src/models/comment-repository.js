const Comment = require("./comment.model");
const User = require("./user.model");

exports.createCommentRepo = async (userId, movieId, content) => {
  const firstName = await getUserFirstNameRepo(userId);

  if (!firstName) {
    throw new Error("User not found");
  }

  const comment = {
    userId: userId,
    firstName: firstName,
    movieId: movieId,
    content: content,
  };

  await Comment.create(comment);
};

const getUserFirstNameRepo = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });
  return user ? user.firstName : null;
};

exports.findCommentByUserAndMovieRepo = async (userId, movieId) => {
  return await Comment.findOne({
    where: { userId, movieId },
    include: [{ model: User, as: "user" }],
  });
};

exports.getCommentsByMovieRepo = async (movieId) => {
  return await Comment.findAll({
    where: { movieId },
    include: [{ model: User, as: "user" }],
  });
};

exports.updateCommentRepo = async (commentId, content) => {
  await Comment.update({ content }, { where: { id: commentId } });
};

exports.deleteCommentRepo = async (commentId) => {
  await Comment.destroy({ where: { id: commentId } });
};
