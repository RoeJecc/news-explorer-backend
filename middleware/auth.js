const jwt = require("jsonwebtoken");
const AuthorizationError = require("../errors/authorization-error");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError("Authentication Required.");
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "super-secret-key"
    );
  } catch (err) {
    throw new AuthorizationError("Authentication Required.");
  }
  req.user = payload;
  next();
};
