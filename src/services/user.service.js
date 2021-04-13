const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }

    const user = await User.create(userBody);
    return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

/**
 * Get a user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
// eslint-disable-next-line arrow-body-style
const getUserById = async (userId) => {
    return User.findById(userId);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updatedBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updatedBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updatedBody.email && (await User.isEmailTaken(updatedBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
    }
    Object.assign(user, updatedBody);
    await user.save();
    return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
// Can also use findByIdAndRemove here.
const deleteUserById = async (userId) => {
    const user = await getUserById(userId);

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
