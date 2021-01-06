const express = require('express');
const passport = require('passport');
const sharp = require('sharp');

const router = new express.Router();

// Load models
const User = require('../models/User');
const Profile = require('../models/Profile');

// Load multer middleware for image file
const upload = require('../validation/upload');

// Load validation
const validateProfileInput = require('../validation/profile');
const validateExperienceInput = require('../validation/experience');
const validateEducationInput = require('../validation/education');

// @route POST /profile/avatar
// @desc Upload user profile image
// @access Private
router.post(
    '/profile/avatar', 
    passport.authenticate('jwt', { session: false }),
    upload.single('avatar'), 
    async (req, res) => { 
        // Find the current user profile
        const profile = await Profile.findOne({ owner: req.user._id });

        //Get user image from request, resize it and convert it to png format
        // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

        // Save the user image to database
        profile.avatar = req.file.buffer;

        await profile.save();
        res.json({ success: true });
    }, 
    (error, req, res, next) => {
        res.status(400).json(error);
    }
);

// @route GET /profile/avatar
// @desc Get user profile image
// @access Private       
router.get('/profile/avatar/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ owner: req.user._id })
        .then((profile) => {
            if (!profile.avatar) {
                errors.avatar = 'Profile avatar not found';

                return res.status(400).json(errors);
            };

            // Set response header
            res.set('content-type', 'image/jpg')
            res.json({ avatar: profile.avatar  });
        })
        .catch((error) => {
            errors.avatar = 'Profile not found';

            res.status(404).json(errors);
        })
});

// @route GET /profile/all
// @desc Get all the profiles
// @access Public
router.get('/profile/all', async (req, res) => {
    const errors = {};

    const profiles = await Profile.find().populate('owner', 'name');

    // Check if there are no profiles, then raise an error
    if (!profiles) {
        errors.profilesnotfound = 'There are no profiles';

        return res.status(404).json(errors);
    };

    res.json(profiles)
});

// @route GET /profile/handle/:handle
// @desc Get user profile by his handle
// @access Public
router.get('/profile/handle/:handle', async (req, res) => {
    const errors = {};

    try {
        const profile = await Profile.findOne({ handle: req.params.handle });

        if (!profile) {
            errors.handle = 'Profile not found';

            return res.status(404).json(errors);
        };

        // Populate owner field of profile model
        await profile.populate('owner', 'name').execPopulate();

        res.json(profile)
    } catch (error) {

        res.status(404).json(error);
    };
});

// @route GET /profile/:id
// @desc Get user profile by his id
// @access Public
router.get('/profile/:id', (req, res) => {
    const errors = {};

    Profile.findById(req.params.id)
        .then( async (profile) => {
            await profile.populate('owner', 'name').execPopulate()

            res.json(profile)
        })
        .catch((error) => {
            errors.id = 'Profile not found';

            res.status(404).json(errors);
        });
});

// @route POST /profile
// @desc Create or edit profile
// @access Private
router.post('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    let { handle, status, location, githubusername, company, bio, skills, website, youtube, facebook, 
        instagram, twitter, linkedin } = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    };

    // Split skills into an array of strings
    skills = skills.split(',');

    // Create a social object
    const social = {};
    
    social.youtube = youtube; 
    social.facebook = facebook; 
    social.twitter = twitter; 
    social.instagram = instagram; 
    social.linkedin = linkedin; 

    const profileInput = {
        owner: req.user._id,
        handle,
        status,
        location,
        githubusername,
        company, 
        bio, 
        skills,
        website,
        social
    }

    // Update the profile if it exists
    const profile = await Profile.findOneAndUpdate({ owner: req.user._id }, profileInput, { new: true });

    if (profile) {
        return res.json(profile);
    };

    // Check if the handle is taken and then raise an error
    if (await Profile.findOne({ handle })) {
        errors.handle = 'Handle is already taken';

        return res.status(400).json(errors);
    };

    // If there is no such handle in the database, then create a new profile
    const newProfile = new Profile(profileInput);

    await newProfile.save();
    res.json(newProfile);
});

// @route GET /profile
// @desc Get user profile
// @access Private
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const profile = await Profile.findOne({ owner: req.user._id });
    const errors = {};

    if (!profile) {
        errors.profilenotfound = 'Profile not found';

        return res.status(400).json(errors);
    };

    res.json(profile);
});

// @route POST /profile/experience
// @desc Add experience to user profile
// @access Private
router.post('/profile/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    let { title, company, from, to, current, description, location } = req.body;

    if (!isValid) {
        return res.status(400).json(errors);
    };

    // Find the current user profile
    const profile = await Profile.findOne({ owner: req.user._id });

    if (!profile) {
        errors.profilenotfound = 'Profile not found';

        return res.status(400).json(errors);
    };

    const newExperience = {
        title,
        company,
        from,
        to,
        current,
        location,
        description
    };

    profile.experience.unshift(newExperience);

    await profile.save();
    res.json(profile);
});

// @route POST /profile/education
// @desc Add education to user profile
// @access Private
router.post('/profile/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    };

    // Find the current user profile
    const profile = await Profile.findOne({ owner: req.user._id });

    // Check if there is no such profile, then raise an error
    if (!profile) {
        errors.profilenotfound = 'Profile not found';

        return res.status(400).json(errors);
    };

    // Add education to user profile
    profile.education.unshift(req.body);

    // Save profile to database
    await profile.save();
    res.json(profile);
    
});

// @route DELETE /profile/experience/exp_id
// @desc Delete experience from user profile
// @access Private
router.delete('/profile/experience/:exp_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const errors = {};

    // Find the current user profile
    const profile = await Profile.findOne({ owner: req.user._id });

    // Check if there is no such profile, then raise an error
    if (!profile) {
        errors.profilenotfound = 'Profile not found';

        return res.status(400).json(errors);
    };

    // Find that experience and remove it from user profile
    profile.experience = profile.experience.filter((experience) => experience._id.toString() !== req.params.exp_id);


    // Save profile to database
    await profile.save();
    res.json(profile);
});

// @route DELETE /profile/education/ed_id
// @desc Delete education from user profile
// @access Private
router.delete('/profile/education/:ed_id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const errors = {};

    // Find the current user profile
    const profile = await Profile.findOne({ owner: req.user._id });

    // Check if the user has no such profile, then raise an error
    if (!profile) {
        errors.profilenotfound = 'Profile not found';

        return res.status(400).json(errors);
    };

    // Find that education and remove it from user profile
    profile.education = profile.education.filter((education) => education._id.toString() !== req.params.ed_id);

    // Save profile to database
    await profile.save();
    res.json(profile);
});

// @route DELETE /profile/:id
// @desc Delete User profile and his account
// @access Private
router.delete('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const errors = {};

    Profile.findOne({ owner: req.user._id })
        .then( async (profile) => {
            if (profile) {
                // Delete user profile
                await Profile.findOneAndDelete({ owner: req.user._id });

                await User.findByIdAndDelete(req.user._id);

                res.json('Your account has been successfully deleted!');
            };
        })
        .catch((error) => {
            errors.id = 'Profile not found';

            res.status(404).json(errors);
        })
});

module.exports = router;