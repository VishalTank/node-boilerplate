const Joi = require('joi');

const { password } = require('./custom.validation');

const register = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().custom(password).required(),
    }),
};

module.exports = {
    register,
};
