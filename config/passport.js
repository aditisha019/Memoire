const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("Google Profile Data:", profile); // Debugging

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name?.givenName || profile.displayName,  // Fallback to displayName
                    lastName: profile.name?.familyName || 'N/A',  // ✅ Prevent validation error
                    image: profile.photos?.[0]?.value || '', // Prevent undefined errors
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    } else {
                        user = await User.create(newUser);
                        return done(null, user);
                    }
                } catch (err) {
                    console.error("Error during authentication:", err);
                    return done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
