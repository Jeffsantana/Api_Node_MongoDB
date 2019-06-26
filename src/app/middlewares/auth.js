/* Libraries */
const jwt = require("jsonwebtoken");
const env = require("dotenv").config().parsed;

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).send({ message: "No token provided" });
    }

    const parts = authHeader.split(" ");

    if (!parts.length === 2) {
      return res.status(400).send({ message: "Token error" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(400).send({ message: "Token malformatted" });
    }

    const result = await jwt.verify(token, env.SECRET_KEY);
    req.user = { ...result.payload };
    next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
