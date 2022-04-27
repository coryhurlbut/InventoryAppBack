const Joi = require('@hapi/joi');

//Register account validation
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z-]/)
            .required(),
        lastName: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z-]/)
            .required(),
        userName: Joi.string()
            .trim()
            .min(6)
            .max(25)
            .regex(/[a-zA-Z0-9_-]/)
            .required(),
        password: Joi.string()
            .default('')
            .regex(/[a-zA-Z0-9!@#$%^&*_+]+/)
            .allow('', null),       //Needed to not error on user accounts that have '' as a password
        userRole: Joi.string()
            .required(),
        phoneNumber: Joi.string()
            .trim()
            .min(10)
            .max(14)
            .regex(/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)
            .required(),
        status: Joi.string()
            .required()
    });
    return schema.validate(data);
}

//Register item validation
const itemValidation = (data) => {
    const schema = Joi.object({
        itemNumber: Joi.string()
            .trim()
            .length(9)
            .regex(/[a-zA-Z0-9-]/)
            .required(),
        name: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z0-9-' ]/)
            .required(),
        description: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z0-9-']/)
            .required(),
        serialNumber: Joi.string()
            .trim()
            .min(1)
            .max(25)
            .regex(/[a-zA-Z0-9-]/)
            .required(),
        notes: Joi.string()
            .default('')
            .max(100)
            .allow('', null),       //Needed to not error on user accounts that have '' as a password
        homeLocation: Joi.string()
            .trim()
            .min(1)
            .max(15)
            .regex(/[a-zA-Z0-9-]/)
            .required(),
        specificLocation: Joi.string()
            .trim()
            .min(1)
            .max(15)
            .regex(/[a-zA-Z0-9-]/)
            .required(),
        available: Joi.boolean()
            .required(),
        possessedBy: Joi.string() //Requirements of username for user
            .default('')
            .allow('', null), 
    });
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        userName: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(8)
            .required(),
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.itemValidation = itemValidation;
module.exports.loginValidation = loginValidation;