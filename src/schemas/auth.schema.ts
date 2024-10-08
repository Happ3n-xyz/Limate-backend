import Joi from "joi";

export const getGoogleAuthUrl = Joi.object({
    redirectUrl: Joi.string().uri().required()
});

export const getGoogleToken = Joi.object({
    code: Joi.string().required(),
    redirectUrl: Joi.string().uri().required()
});

export const requestNonce = Joi.object({
    address: Joi.string().required()
});

export const signIn = Joi.object({
    address: Joi.string().required(),
    nonce: Joi.string().required(),
    signature: Joi.string().required(),
    message: Joi.any(),
});
