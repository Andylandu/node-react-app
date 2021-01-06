const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = new express.Router();

// Load jwt signature keys
const keys = require('../config/keys');

// Load models
const User = require('../models/User');

// Load validations
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// @route POST /users/register
// @desc Register user
// @access Public
router.post('/users/register', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    const { name, email, password } = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    };

    try {
        // Check if that email already exists in the database
        const user = await User.findOne({ email });

        if (user) {
            errors.email = 'Email address already exists';

            return res.status(400).json(errors);
        };

        const newUser = new User({ name, email, password });

        // Save to database
        await newUser.save();
        res.json(newUser);
    } catch (e) {
        res.status(400).json(e);
    }

});

// @route POST /users/login
// @desc Login user
// @access Public
router.post('/users/login', async (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    const { email, password } = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    };

    try {
        // Find the user by his email in the database
        const user = await User.findOne({ email });

        if (!user) {
            errors.email = 'User not found';

            return res.status(400).json(errors);
        };

        // Check the user password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            errors.password = 'Password is incorrect';

            return res.status(400).json(errors);
        };

        // Generate Auth token and send it back
        const payload = { _id: user._id, name: user.name } // jwt payload
        const token = jwt.sign(payload, keys.secretOrKey);

        res.json({ success: true, token: `Bearer ${token}` });
    } catch (e) {
        res.status(400).json(e);
    };
});

// @route GET /users/me
// @desc Get user name
// @access Private
router.get('/users/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.json(req.user);
})

module.exports = router;