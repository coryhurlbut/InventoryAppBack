const Joi = require('@hapi/joi');

//Register account validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(1)
            .required(),
        lastName: Joi.string()
            .min(1)
            .required(),
        userName: Joi.string()
            .min(6),
        password: Joi.string()
            .min(6),
        userRole: Joi.string()
            .required(),
        phoneNumber: Joi.string()
            .length(10)
            .required(),
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        userName: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;