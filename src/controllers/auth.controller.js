const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const tokenService = require('../services/token.service');

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthToken(user);

    res.status(httpStatus.CREATED).send({ user, tokens });
});

module.exports = {
    register,
};
