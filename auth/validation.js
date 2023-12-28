const Joi = require("@hapi/joi");

exports.validateSignUp = (req, res, next) => {
  if (isNaN(req.body.phoneNumber))
    return res.status(400).send({ message: "phone number is not a number" });
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().max(255).required(),
    phoneNumber: Joi.string().min(7).max(21).required(),
    pubKey: Joi.string().required(),
    state: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  return next();
};

exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.string().min(7).max(21).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  const { error } = schema.validate(req.query);
  if (error) return res.status(400).send({ error: error.details[0].message });
  return next();
};
