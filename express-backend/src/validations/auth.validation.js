var Joi = require('joi');

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().required().min(5),
    })
};

const register = {
    body: Joi.object().keys({
        email: Joi.string().email().trim().lowercase().required(),
        password: Joi.string().required().min(5),
    })
};

const generateLink = {
    params: Joi.object().keys({
        userId: Joi.number().required(),
    })
};
const verifyLink = {
    params: Joi.object().keys({
        link: Joi.string().required(),
    })
};

const getServerTime = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    })
};

module.exports = {
    login,
    register,
    generateLink,
    verifyLink,
    getServerTime
}