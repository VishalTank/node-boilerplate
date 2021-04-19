const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');
const authService = require('../services/auth.service');
const emailService = require('../services/email.service');

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthToken(user);

    res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.loginWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthToken(user);

    res.status(httpStatus[200]).send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);

    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuthTokens(req.body.refreshToken);

    res.status(httpStatus[200]).send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
};
