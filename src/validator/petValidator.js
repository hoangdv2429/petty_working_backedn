const Joi = require('@hapi/joi');

const PetValidator = {
    CreateSchema: Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),

        dob: Joi.string()
            .required(),

        gender: Joi.string()
            .required(),

        type: Joi.string()
            .required(),

        class: Joi.string()
            .required(),

        resource: Joi.string()
            .required(),
        status: Joi.allow(), address: Joi.allow()
    }).options({ abortEarly: false }),
    UpdateSchema: Joi.object({
        id: Joi.required(),
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),

        dob: Joi.string()
            .required(),

        gender: Joi.string()
            .required(),

        type: Joi.string()
            .required(),

        class: Joi.string()
            .required(),
        
        resource: Joi.string()
            .required(),
        status: Joi.allow(), address: Joi.allow(),
        userId: Joi.required(),
        createdAt: Joi.allow(),
        updatedAt: Joi.allow()
    }).options({ abortEarly: false }),
}

export default PetValidator;