const { sign } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

exports.generateAuthToken = (userId, firstName, isAdmin) => {
  const permissions = isAdmin ? ["admin"] : [];

  return sign({ userId, firstName, permissions }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_ON,
  });
};

exports.verifyToken = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};
