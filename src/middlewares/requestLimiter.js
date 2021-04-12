const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
});

module.exports = {
    authLimiter,
};
