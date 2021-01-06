const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Load jwt signature keys
const keys = require('../config/keys');

// Load user model
const User = require('../models/User');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {            
            // Find the user by his id in the database 
            const _id = jwt_payload._id
            const user = await User.findById(_id);

            if (user) {
                return done(null, user);
            };

            return (null, false);
        } catch (e) {
            console.log(e);
        }
    }));
};