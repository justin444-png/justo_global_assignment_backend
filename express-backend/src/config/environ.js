var Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envValidate = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development'),
        PORT: Joi.number().allow('').empty('').default(3005),

        DB_HOST: Joi.string().allow('').empty('').default('127.0.0.1'),
        DB_PORT: Joi.number().allow('').empty('').default(3306),
        DB_NAME: Joi.string().allow('').empty('').default('gdc'),
        DB_USER: Joi.string().allow('').empty('').default('gdc'),
        DB_PASSWORD: Joi.string().allow('').empty('').default(''),

        SALT: Joi.number().default(10),
    })
    .unknown();

    
const { value: env, error } = envValidate.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config env error: ${error.message}`);
}

module.exports = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,

    DB_HOST: env.DB_HOST,
    DB_PORT: env.DB_PORT,
    DB_NAME: env.DB_NAME,
    DB_PERSONAL_NAME: env.DB_PERSONAL_NAME,
    DB_USER: env.DB_USER,
    DB_PASSWORD: env.DB_PASSWORD,
    SALT: env.SALT,

    
};