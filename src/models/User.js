const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../db/mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

// Hash the user password before saving it
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    };

    next();
});

// Delete user password when send his data back
userSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    
    return userObject;
};

// Relationship between User and Profile models
userSchema.virtual('Profile', {
    ref: 'Profile',
    localField: '_id',
    foreignField: 'owner'
});

const User = mongoose.model('User', userSchema);

module.exports = User;