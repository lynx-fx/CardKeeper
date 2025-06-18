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
  newPassword: Joi.string().required()
    .min(6)
    .max(20)
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .messages({
      "String.pattern.base":
        "Password must be between 6 and 30 characters long and contain only alphanumeric characters",
    }),
})
