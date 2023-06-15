const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const guard = require("express-jwt-permissions")({
  requestProperty: "auth",
});

const { verifyCaptcha } = require("../validation/route.validator");

const {
  getUsers,
  getAccount,
  getUserByFirstName,
  signup,
  deleteUser,
  deleteUserYourself,
} = require("../user.controller");

router.get("/account", getAccount);

router.post(
  "/signup",
  //verifyCaptcha,
  body("firstName")
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "Le prénom ne peut contenir que des lettres et doit avoir une longueur maximale de 50 caractères."
    ),
  body("lastName")
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "Le nom ne peut contenir que des lettres et doit avoir une longueur maximale de 50 caractères."
    ),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 5, max: 50 })
    .withMessage("Le mot de passe doit contenir entre 5 et 50 caractères."),
  body("isAdmin").isBoolean(),
  signup
);

router.get("/list", guard.check("admin"), getUsers);
router.get("/:firstName", guard.check("admin"), getUserByFirstName);
router.delete("/delete", deleteUserYourself);
router.delete("/:id", guard.check("admin"), deleteUser);

exports.initializeRoutes = () => router;
