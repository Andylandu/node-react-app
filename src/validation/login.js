const validator = require('validator');
const isEmpty = require('./is-empty');

const validateLoginInput = (data) => {
    let { email , password } = data;
    const errors = {};

    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';

    if (!validator.isEmail(email)) {
        errors.email = 'Email is invalid';
    };

    if (validator.isEmpty(email)) {
        errors.email = 'Email field is required';
    };

    if (!validator.isLength(password, { min: 6, max: 50 })) {
        errors.password = 'Password must be at least 6 characters';
    };

    if (validator.isEmpty(password)) {
        errors.password = 'Password field is required';
    };

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateLoginInput;