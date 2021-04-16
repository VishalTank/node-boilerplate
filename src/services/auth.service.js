const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const Token = require('../models/token.model');
const { tokenTypes } = require('../config/tokens');

const loginWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);

    if (!user || !user.doesPasswordMatch(password)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Email or Password');
    }

    return user;
};

const logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, typ: tokenTypes.REFRESH, blacklisted: false });

    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }

    await refreshTokenDoc.remove();
};

module.exports = {
    loginWithEmailAndPassword,
    logout,
};
