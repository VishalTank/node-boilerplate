const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('Password must be at least 8 characters long');
    }

    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('Password must contain at least 1 digit and 1 letter');
    }
    return value;
}

module.exports = {
    password,
}
