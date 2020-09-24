import * as passport from 'passport';
import * as mongoose from 'mongoose';
const LocalStrategy = require('passport-local').Strategy;

import User from '../models/user';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, {
          message: 'User not found.'
        });
      }

      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong.'
        });
      }

      return done(null, user);
    });
  }
));
