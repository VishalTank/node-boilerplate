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
    },
};
