const express = require("express");
const router = express.Router();
const { login } = require("../auth.controller");
const { verifyToken } = require("../../security/auth");
const { body } = require("express-validator");

router.post("/login", body("firstName").notEmpty(), body("password").notEmpty(), login);
router.get("/verify-token", verifyToken);

exports.initializeRoutes = () => router;
