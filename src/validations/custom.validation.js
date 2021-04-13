const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('Password must be at least 8 characters long');
    }

    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('Password must contain at least 1 digit and 1 letter');
    }
    return value;
};

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid Mongo ID');
    }
    return value;
};

module.exports = {
    password,
    objectId,
};
