import Joi from "joi";

export const createLimate = Joi.object({
    username: Joi.string().required(),
    code: Joi.string().required()
});
