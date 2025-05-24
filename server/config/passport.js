// src/config/passport.js or wherever you're configuring passport
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
// console.log("GOOGLE_CLIENT_ID: ", process.env.GOOGLE_CLIENT_ID);  // Check if it's correctly loaded
// console.log("GOOGLE_CLIENT_SECRET: ", process.env.GOOGLE_CLIENT_SECRET);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"http://localhost:3000/auth/google/callback",
      scope: ['profile', 'email'],
      passReqToCallback: true,
      prompt: 'select_account' 
    },
    async (req,accessToken, refreshToken, profile, done) => {
      try {
        // find or create the user
        let user = await User.findOne({ googleId: profile.id });
        const validRoles = ['farmer', 'admin'];
const incomingRole = req.session.role;
const finalRole = validRoles.includes(incomingRole) ? incomingRole : 'farmer';

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            userName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            role: finalRole
             // add other fields if necessary
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// For session support
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
