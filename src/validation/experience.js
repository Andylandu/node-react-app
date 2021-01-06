const validator = require('validator');
const isEmpty = require('./is-empty');

const validateExperienceInput = (data) => {
    const errors = {};
    let { title, company, from } = data;

    title = !isEmpty(title) ? title : '';
    company = !isEmpty(company) ? company : '';
    from = !isEmpty(from) ? from : '';

    if (validator.isEmpty(title)) {
        errors.title = 'Title field is required';
    };

    if (validator.isEmpty(company)) {
        errors.company = 'Company field is required';
    };

    if (validator.isEmpty(from)) {
        errors.from = 'From field is required';
    };

    return {
        errors,
        isValid: isEmpty(errors)
    }
};

module.exports = validateExperienceInput;