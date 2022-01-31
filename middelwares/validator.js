const Validator = require('validatorjs');

exports.validate = (rules) => {
  return function (req, res, next) {
    const validation = new Validator(req.body, rules);
    if (validation.fails()) validation.fails(res.status(422).send(validation.errors));
    else next();
  };
};
