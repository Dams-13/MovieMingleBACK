const uuid = require("uuid");
const { generateHashedPassword } = require("../security/crypto");
const User = require("./user.model");

exports.getUsersRepo = async () => await User.findAll();

exports.getUserByFirstNameRepo = async (firstName) => {
  return await User.findOne({ where: { firstName } });
};

exports.createUserRepo = async (body) => {
  const existingUser = await User.findOne({
    where: { firstName: body.firstName },
  });

  if (existingUser) {
    const err = new Error("Un utilisateur avec ce prénom existe déjà.");
    err.status = 400;
    throw err;
  }

  const hashedPassword = generateHashedPassword(body.password);
  const user = body;
  user.id = uuid.v4();
  user.password = hashedPassword;

  const createdUser = await User.create(user);
  return createdUser.id;
};

exports.deleteUserRepo = async (id) => {
  const deleteCount = await User.destroy({ where: { id } });

  if (deleteCount === 0) {
    throw new Error("Id introuvable");
  }

  return "L'utilisateur est supprimé avec succès";
};

exports.getUserByIdRepo = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
};
