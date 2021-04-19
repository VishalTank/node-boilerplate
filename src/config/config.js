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
        JWT_ACCESS_TOKEN_EXPIRY_IN_MINUTES: Joi.number().default(30).description('Expiration time for access token in minutes'),
        JWT_REFRESH_TOKEN_EXPIRY_IN_DAYS: Joi.number().default(30).description('Expiration time for refresh token in days'),
        JWT_RESET_PASSWORD_TOKEN_EXPIRY_IN_MINUTES: Joi.number().default(10).description('Expiration time for reset password token in minutes'),
        JWT_VERIFY_EMAIL_TOKEN_EXPIRY_IN_MINUTES: Joi.number().default(10).description('Expiration time for email verification token in minutes'),
        SMTP_HOST: Joi.string().description('Server for sending Emails'),
        SMTP_PORT: Joi.number().description('Port of the Email Server'),
        SMTP_USERNAME: Joi.string().description('Username for the Email Server'),
        SMTP_PASSWORD: Joi.string().description('Password for the Email Server'),
        EMAIL_FROM: Joi.string().description('Email sender'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

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
        refreshTokenExpiryInDays: envVars.JWT_REFRESH_TOKEN_EXPIRY_IN_DAYS,
        resetPasswordTokenExpiryInMinutes: envVars.JWT_RESET_PASSWORD_TOKEN_EXPIRY_IN_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_TOKEN_EXPIRY_IN_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
};
