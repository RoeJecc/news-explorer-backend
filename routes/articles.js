const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const { validateURL } = require("../middleware/urlValidator");
const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");

router.get("/", getArticles);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().custom(validateURL),
      image: Joi.string().required().custom(validateURL),
    }),
  }),
  createArticle
);

router.delete(
  "/:id",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteArticle
);

module.exports = router;