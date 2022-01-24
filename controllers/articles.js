const Article = require("../models/article");
const NotFoundError = require("../errors/not-found-error");
const AuthorizationError = require("../errors/authorization-error");
const BadRequestError = require("../errors/bad-request-error");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => req.status(200).send({ articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const { title, keyword, text, date, source, link, image } = req.body;

  Article.create({
    title,
    keyword,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.status(201).send({ article }))
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.id)
    .then((article) => {
      if (!article) {
        throw new NotFoundError("Article not found.");
      } else if (article.owner.toString() !== req.user._id) {
        throw new AuthorizationError("Not authorized.");
      }
      Article.deleteOne(article).then((article) => {
        if (article) {
          return res.status(200).send({ article });
        } else {
          next(err);
        }
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid data passed.");
      } else {
        next(err);
      }
    });
};

