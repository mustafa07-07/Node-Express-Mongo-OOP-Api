const Joi = require("joi");
const createValidation = Joi.object({
  name: Joi.string().required().min(3),
  username: Joi.string().required().min(3),
  password: Joi.string().required().min(6),
  email: Joi.string().required().email().min(3),
});
const loginValidation = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().required().email().min(3),
});
const resetPasswordValidation = Joi.object({
  email: Joi.string().required().email().min(3),
});
const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(3),
});
const profileImageValidation = Joi.object({
  ProfileImg: Joi.string().min(3),
});
const updateValidation = Joi.object({
  name: Joi.string().min(3),
  username: Joi.string().min(3),
  email: Joi.string().email().min(3),
});
module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation,
  profileImageValidation
};
