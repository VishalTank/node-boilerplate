const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const result = await userService.getAllUsers(filter, options);
    res.status(httpStatus.OK).send(result);
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).send(user);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.OK).send(user);
});

const deleteUser = catchAsync(async (req, res) => {
    const deletedUser = await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.OK).send(deletedUser);
});

module.exports = {
    createUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
