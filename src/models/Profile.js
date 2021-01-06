const mongoose = require('mongoose');
require('../db/mongoose');

const profileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    handle: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        max: 40
    },
    avatar: {
        type: Buffer
    },
    status: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    skills: {
        type: [String],
        required: true
    },
    website: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        facebook: {
            type: String
        },
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        }
    },
    experience: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ]
}, { timestamps: true });

// Remove avatar field from profile when sending back profile
profileSchema.methods.toJSON = function () {
    const profile = this;

    const profileObject = profile.toObject();

    delete profileObject.avatar;

    return profileObject;
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
