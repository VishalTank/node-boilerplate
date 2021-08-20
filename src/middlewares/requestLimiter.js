const rateLimit = require('express-rate-limit');

const { TOO_MANY_REQUESTS } = require('../utils/messages');

const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
        error: TOO_MANY_REQUESTS,
    },
});

module.exports = {
    apiLimiter,
};
