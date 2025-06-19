const Joi = require("Joi");

exports.signUpSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: {
        allow: ["com", "net", "org"],
      },
    })
    .required()
    .min(6)
    .max(20),
  password: Joi.string()
    .required()
    .min(6)
    .max(20)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .messages({
      "String.pattern.base":
        "Password must be between 6 and 30 characters long and contain only alphanumeric characters",
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
