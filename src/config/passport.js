const { Strategy, ExtractJwt } = require('passport-jwt');

const config = require('./config');
const { User } = require('../models');
const { tokenTypes } = require('./tokens');

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (reqObj, done) => {
    try {
        if (reqObj.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }

        const user = await User.findById(reqObj.sub);
        if (user) {
            return done(null, user);
        }

        done(null, false);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
