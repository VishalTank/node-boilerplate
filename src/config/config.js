const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('development', 'QA', 'production').required(),
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required('Database URL'),
        JWT_SECRET: Joi.string().required('Auth(JWT) token'),
        JWT_ACCESS_TOKEN_EXPIRY_IN_MINUTES: Joi.number()
            .default(30)
            .description('Expiration time for access token in minutes'),
        JWT_REFRESH_TOKEN_EXPIRY_IN_DAYS: Joi.number().default(30).description('Expiration time for refresh token in days'),
    })
    .unknown();

const { value: envVars } = envVarsSchema.validate(process.env);

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'dev' ? '-dev' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessTokenExpiryInMinutes: envVars.JWT_ACCESS_TOKEN_EXPIRY_IN_MINUTES,
        refreshTokenExpiryInMinutes: envVars.JWT_REFRESH_TOKEN_EXPIRY_IN_DAYS,
    },
};
