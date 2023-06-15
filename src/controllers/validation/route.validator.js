const { validationResult } = require("express-validator");
const axios = require("axios");

const formatBodyErrMessage = (valResult) => {
  const [firstErr] = valResult.array({ onlyFirstError: true });

  return `Property "req.body.${firstErr.param}": ${firstErr.msg}. Current value = ${firstErr.value}`;
};

exports.validateBody = (req) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    throw new Error(formatBodyErrMessage(valResult));
  }
};

exports.verifyCaptcha = async (req, res, next) => {
  const recaptchaSecret = "6LcVbuUlAAAAAAE8xkTFlMw52uSrNdrGBfdriLYi";
  const recaptchaResponse = req.body["g-recaptcha-response"];

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: recaptchaSecret,
          response: recaptchaResponse,
        },
      }
    );

    if (response.data.success) {
      const minScore = 0.5;

      if (response.data.score >= minScore) {
        next();
      } else {
        res
          .status(400)
          .json({ message: "Captcha invalide ou score trop faible" });
      }
    } else {
      res.status(400).json({ message: "Captcha invalide" });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification du captcha :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la vérification du captcha" });
  }
};
