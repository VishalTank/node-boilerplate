const moment = require('moment');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const { tokenTypes } = require('../config/tokens');
const config = require('../config/config');
const Token = require('../models/token.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const generateToken = (userId, expiry, type, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expiry.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expiry, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expiry.toDate(),
        type,
        blacklisted,
    });

    return tokenDoc;
};

const generateAuthToken = async (user) => {
    const accessTokenExpiry = moment().add(config.jwt.accessTokenExpiryInMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpiry, tokenTypes.ACCESS);

    const refreshTokenExpiry = moment().add(config.jwt.refreshTokenExpiryInDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpiry, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpiry, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpiry.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpiry.toDate(),
        },
    };
};

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });

    if (!tokenDoc) {
        throw new Error('Token not found');
    }

    return tokenDoc;
};

const generateResetPasswordToken = async (email) => {
    const user = await User.findOne(email);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }

    const expires = moment().add(config.jwt.resetPasswordTokenExpiryInMinutes, 'minutes');
    const resetPasswordToken = generateToken(user._id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user._id, expires, tokenTypes.RESET_PASSWORD);

    return resetPasswordToken;
};

module.exports = {
    generateToken,
    saveToken,
    generateAuthToken,
    verifyToken,
    generateResetPasswordToken,
};
