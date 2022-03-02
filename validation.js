const Joi = require('@hapi/joi');

//Register account validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z]/)
            .required(),
        lastName: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z]/)
            .required(),
        userName: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .default('')
            .allow('', null),       //Needed to not error on user accounts that have '' as a password
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