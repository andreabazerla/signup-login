import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';

import * as fs from 'fs';
import * as path from 'path';

// Model of User
import User from '../models/user';

// Public key
const pathToKey = path.resolve(__dirname, './../keys/id_rsa_priv.pem');
const PUBLIC_KEY = fs.readFileSync(pathToKey, 'utf8');

// Options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUBLIC_KEY,
  algorithms: ['RS256'],
  audience: 'https://affittagram.com'
};

// Function that set passport from app.ts file
function setPassport(passport): void {
  passport.use(
    new JwtStrategy(options,
      (jwtPayload, done) => {
        User.findOne({ _id: jwtPayload.sub }, (err, user) => {
          if (err) {
            return done(err);
          }

          if (user) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Unknown user'});
          }
        });
      }
    )
  );
}

export default setPassport;
