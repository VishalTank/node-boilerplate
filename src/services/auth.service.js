const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

const loginWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail();

    if (!user || !user.doesPasswordMatch(password)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Email or Password');
    }

    return user;
};

module.exports = {
    loginWithEmailAndPassword,
};
