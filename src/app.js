const express = require('express');
const helmet = require('helmet');
const mongoDbSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');

const routes = require('./routes');
const morgan = require('./config/morgan');
const config = require('./config/config');
const { jwtStrategy } = require('./config/passport');
const { apiLimiter } = require('./middlewares/requestLimiter');
const { ApiError } = require('./utils/ApiError');
const { errorConverter, errorHandler } = require('./middlewares/error');

const app = express();

// HTTP Request logs
if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// Set HTTP headers
app.use(helmet());

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: '50mb' }));

// Parse nested objects in a request
app.use(express.urlencoded({ extended: true }));

// Sanitize request to prevent MongoDB injection
app.use(mongoDbSanitize());

// Enable CORS
app.use(cors());

// JWT Authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Limit requests to prevent spamming on auth endpoints
app.use('/api/auth', apiLimiter);

// API Routes
app.use('/api', apiLimiter, routes);

// 404 Response for invalid API requests
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

// convert errors to ApiError, if needed
app.use(errorConverter);

// handle errors
app.use(errorHandler);

module.exports = app;
