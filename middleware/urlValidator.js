const validator = require('validator');

module.exports.validateURL = (string) => {
  if (!validator.isURL(string)) {
    throw new Error('Not a valid URL.');
  }
  return string;
}