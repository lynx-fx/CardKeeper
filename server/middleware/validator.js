const Joi = require("joi");

exports.signUpSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ["com", "net"] } }),
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .pattern(/^[\x20-\x7E]+$/)
    .messages({
      "string.pattern.base":
        "Password must be 8–30 characters long and can include letters, numbers, and special characters.",
    }),
});

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .required()
    .min(8)
    .max(20)
    .pattern(/^[\x20-\x7E]+$/)
    .messages({
      "string.pattern.base":
        "Password must be 8–30 characters long and can include letters, numbers, and special characters.",
    }),
});

exports.cardValidationSchema = Joi.object({
  productName: Joi.string().required(),
  brand: Joi.string().required(),
  purchaseDate: Joi.date().required(),
  category: Joi.string().required(),
  warrantyExpiry: Joi.date().required(),
  purchasePrice: Joi.number().required(),
  store: Joi.string().required(),
  serialNumber: Joi.string().required(),
  warrantyType: Joi.string().required(),
  description: Joi.string().optional().allow("", null),
  imageUri: Joi.string().optional().allow("", null),
});

exports.cardUpdateValidationSchema = Joi.object({
  productName: Joi.string().required(),
  brand: Joi.string(),
  category: Joi.string(),
  warrantyExpiry: Joi.date().required(),
  purchaseDate: Joi.date(),
  serialNumber: Joi.string().required(),
  warrantyPeriod: Joi.number(),
  purchasePrice: Joi.number(),
  store: Joi.string(),
  warrantyType: Joi.string(),
  description: Joi.string().optional().allow("", null),
});
