const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../comment.controller");

router.get("/:movieId", getComments);
router.post(
  "/",
  [
    check("movieId").notEmpty().withMessage("Le movieId est obligatoire"),
    check("content").notEmpty().withMessage("Le contenu est obligatoire"),
  ],
  createComment
);
router.put(
  "/:commentId",
  [
    check("content").notEmpty().withMessage("Le contenu est obligatoire"),
  ],
  updateComment
);
router.delete("/:commentId", deleteComment);

exports.initializeRoutes = () => router;
