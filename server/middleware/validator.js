const Joi = require("Joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .messages({
      "string.pattern.base":
        "Password must be between 3 and 30 characters long and contain only alphanumeric characters",
    }),
});

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .min(6)
    .max(20)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .messages({
      "String.pattern.base":
        "Password must be between 6 and 30 characters long and contain only alphanumeric characters",
    }),
});

exports.cardValidationSchema = Joi.object({
  brand: Joi.string().required(),
  category: Joi.string().required(),
  purchaseDate: Joi.date().required(),
  warrantyPeriod: Joi.number().required(),
  purchasePrice: Joi.number().required(),
  store: Joi.string().required(),
  warrantyType: Joi.string().required(),
  description: Joi.string().optional().allow("", null),
  imageUri: Joi.string().uri().optional().allow("", null),
});

exports.cardUpdateValidationSchema = Joi.object({
  brand: Joi.string(),
  category: Joi.string(),
  purchaseDate: Joi.date(),
  warrantyPeriod: Joi.number(),
  purchasePrice: Joi.number(),
  store: Joi.string(),
  warrantyType: Joi.string(),
  description: Joi.string().optional().allow("", null),
});
