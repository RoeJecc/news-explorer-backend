const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    title, keyword, text, date, source, link, image,
  } = req.body;

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
  Article.findByIdAndRemove(req.params.id)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Article not found.');
      } else if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Access forbidden.');
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data passed.'));
      } return next(err);
    });
};
