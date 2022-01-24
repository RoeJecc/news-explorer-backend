const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
require("dotenv").config();
const userRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const { requestLogger, errorLogger } = require("./middleware/logger");
const NotFoundError = require("./errors/not-found-error");

const app = express();

app.use(cors());
app.options("*", cors());

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/news-explorer");

app.use(helmet());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);
app.use(errors());
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    }),
  }),
  createUser
);

app.use(auth);
app.use("/users", userRouter);
app.use("/articles", articlesRouter);

app.get("*", () => {
  throw new NotFoundError("Requested resource not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}...`);
});
