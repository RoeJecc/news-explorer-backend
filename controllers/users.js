const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const AuthorizationError = require('../errors/authorization-error');
const ConflictError = require('../errors/conflict-error');

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((userExists) => {
      if (userExists) {
        throw new ConflictError('User already exists.');
      }

      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
        }))
        .then((user) => res.status(201).send({
          _id: user._id,
          email: user.email,
        }))
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Not Authorized');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key',
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('User not found.');
    } else {
      return res.status(200).send({ user: { _id: user._id, email: user.email, name: user.name } });
    }
  });
};
