import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import { randomPassword } from '../helpers/random';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV == 'production'
          ? process.env.GOOGLE_AUTH_CALLBACK_URL
          : 'http://localhost:3000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOne({
        provider: 'google',
        providerId: profile.id,
        email: profile.emails[0].value,
        role: 'normal',
      });

      if (user) {
        return cb(null, user);
      } else {
        const password = randomPassword(8);

        const newUser = new User({
          provider: 'google',
          providerId: profile.id,
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password,
        });
        await newUser.save();

        return cb(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

export default passport;
