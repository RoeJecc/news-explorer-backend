const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
require("dotenv").config();
const userRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");

const app = express();

app.use(cors());
app.options("*", cors());

const { PORT = 3000, NODE_ENV } = process.env;

mongoose.connect("mongodb://localhost:27017/news-explorer");

app.use(helmet());
app.use(express.json());

app.post("/signin", login);

app.post("/signup", createUser);

app.use(auth);
app.use("/users", userRouter);
app.use("/articles", articlesRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}...`);
});
