const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

const {
  createCommentRepo,
  findCommentByUserAndMovieRepo,
  getCommentsByMovieRepo,
  updateCommentRepo,
  deleteCommentRepo,
} = require("../models/comment-repository");
const { validateBody } = require("./validation/route.validator");

exports.createComment = async (req, res) => {
  try {
    validateBody(req);
    const userId = req.auth.userId;
    const movieId = req.body.movieId;
    const content = DOMPurify.sanitize(req.body.content);

    const existingComment = await findCommentByUserAndMovieRepo(
      userId,
      movieId
    );

    if (existingComment) {
      console.error("User has already commented on this movie");
      return res
        .status(400)
        .json({ error: "User has already commented on this movie" });
    }

    await createCommentRepo(userId, movieId, content);

    res.status(201).json({ message: "Comment successfully created" });
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment" });
  }
};

exports.getComments = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const comments = await getCommentsByMovieRepo(movieId);
    const formattedComments = comments.map((comment) => ({
      ...comment.get(),
      user: {
        userId: comment.user.id,
        firstName: comment.user.firstName,
      },
    }));
    res.status(200).json(formattedComments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while getting the comments" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    validateBody(req);
    const userId = req.auth.userId;
    const commentId = req.params.commentId;
    const content = DOMPurify.sanitize(req.body.content);

    await updateCommentRepo(commentId, content);
    res.status(200).json({ message: "Comment successfully updated" });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the comment" });
  }
};

exports.deleteComment = async (req, res) => {
  const userId = req.auth.userId;
  const commentId = req.params.commentId;

  try {
    await deleteCommentRepo(commentId);
    res.status(200).json({ message: "Comment successfully deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment" });
  }
};
