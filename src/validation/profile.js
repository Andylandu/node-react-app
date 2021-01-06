const validator = require('validator');
const isEmpty = require('./is-empty');

const validateProfileInput = (data) => {
    const errors = {};
    let { handle, status, skills, website, youtube, facebook, instagram, twitter, linkedin } = data;

    handle = !isEmpty(handle) ? handle : '';
    status = !isEmpty(status) ? status : '';
    skills = !isEmpty(skills) ? skills : '';
    website = !isEmpty(website) ? website : '';
    youtube = !isEmpty(youtube) ? youtube : '';
    facebook = !isEmpty(facebook) ? facebook : '';
    instagram = !isEmpty(instagram) ? instagram : '';
    twitter = !isEmpty(twitter) ? twitter : '';
    linkedin = !isEmpty(linkedin) ? linkedin : ''; 

    if (!validator.isLength(handle, { min: 4, max: 40 })) {
        errors.handle = 'Handle must be at least 2 characters';
    };

    if (validator.isEmpty(handle)) {
        errors.handle = 'Handle field is required';
    };

    if (validator.isEmpty(skills)) {
        errors.skills = 'Skills field is required';
    };

    if (validator.isEmpty(status)) {
        errors.status = 'Status field is required';
    };

    if (!validator.isEmpty(website) && !validator.isURL(website)) {
        errors.website = 'Url is invalid';
    };

    if (!validator.isEmpty(youtube) && !validator.isURL(youtube)) {
        errors.youtube = 'Url is invalid';
    };

    if (!validator.isEmpty(facebook) && !validator.isURL(facebook)) {
        errors.facebook = 'Url is invalid';
    };

    if (!validator.isEmpty(instagram) && !validator.isURL(instagram)) {
        errors.instagram = 'Url is invalid';
    };

    if (!validator.isEmpty(twitter) && !validator.isURL(twitter)) {
        errors.twitter = 'Url is invalid';
    };

    if (!validator.isEmpty(linkedin) && !validator.isURL(linkedin)) {
        errors.linkedin = 'Url is invalid';
    };

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateProfileInput;