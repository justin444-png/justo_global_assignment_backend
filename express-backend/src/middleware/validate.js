var Joi = require('joi');
var _ = require('lodash');

const validate = (schema) => (req, res, next) => {
    const validSchema = _.pick(schema, ['params', 'query', 'body']);
    const object = _.pick(req, Object.keys(validSchema));
    const { error, value } = Joi.compile(validSchema, )
        .prefs({ errors: { label: 'path', wrap: { label: false } }, abortEarly: false })
        .validate(object, { stripUnknown: true });
    if (error) {
        return next(error);
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;