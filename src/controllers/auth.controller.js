const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const { getUserByFirstNameRepo } = require("../models/user-repository");
const { generateAuthToken } = require("../security/auth");
const { passwordsAreEqual } = require("../security/crypto");
const { validateBody } = require("./validation/route.validator");

exports.login = async (req, res) => {
  try {
    validateBody(req);
  } catch (e) {
    res.status(500).send(e.message);
    return;
  }

  let { firstName, password } = req.body;

  // Nettoyage des entrées avec DOMPurify
  firstName = DOMPurify.sanitize(firstName);
  password = DOMPurify.sanitize(password);

  const user = await getUserByFirstNameRepo(firstName);
  if (!user || !(user && passwordsAreEqual(password, user.password))) {
    res.status(401).send("Unauthorized");

    return;
  }

  const token = generateAuthToken(user.id, user.firstName, user.isAdmin);

  res.json({ token });
};
