const httpStatus = require('http-status');

const { tokenTypes } = require('../config/tokens');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');
const tokenService = require('./token.service');

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

const refreshAuthTokens = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user);

        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return tokenService.generateAuthToken(user);
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate yourself');
    }
};

module.exports = {
    loginWithEmailAndPassword,
    logout,
    refreshAuthTokens,
};
