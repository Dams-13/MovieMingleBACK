const {
  getUsersRepo,
  getUserByFirstNameRepo,
  createUserRepo,
  deleteUserRepo,
  getUserByIdRepo,
} = require("../models/user-repository");

const { validateBody } = require("./validation/route.validator");

exports.getUsers = async (req, res) => {
  res.send(await getUsersRepo());
};

exports.getAccount = async (req, res) => {
  console.log("Inside /account route");
  console.log("req.auth:", req.auth);
  const userId = req.auth.userId;
  const user = await getUserByIdRepo(userId);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const response = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: user.isAdmin ? ["admin"] : [],
    createdAt: user.createdAt,
  };

  res.send(response);
};

exports.getUserByFirstName = async (req, res) => {
  const foundUser = await getUserByFirstNameRepo(req.params.firstName);

  if (!foundUser) {
    res.status(500).send("User not found");
    return;
  }

  res.send(foundUser);
};

exports.signup = async (req, res) => {
  try {
    validateBody(req);
    const userId = await createUserRepo(req.body);
    res.status(201).json({ success: true, userId });
  } catch (e) {
    res.status(e.status || 500).send(e.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const message = await deleteUserRepo(req.params.id);
    res.status(200).send(message);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.deleteUserYourself = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const message = await deleteUserRepo(userId);
    res.status(200).json({ message: message });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
