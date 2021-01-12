import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';
import * as path from 'path';
import * as fs from 'fs';

// Luxon
import { DateTime } from 'luxon';

const pathToKey = path.resolve(__dirname, './../keys/id_rsa_priv.pem');
const PRIVATE_KEY = fs.readFileSync(pathToKey, 'utf8');

const UserSchema: mongoose.Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

enum Gender {
  Male = 1,
  Female = 0,
}

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  hash: string;
  salt: string;
  gender: Gender;
  birthday: Date;
  setPassword(iUser: IUser, password: string): void;
  checkPassword(iUser: IUser, password: string): boolean;
  generateJwt(iUser: IUser): TokenPayload;
}

interface TokenPayload {
  token: string;
  expiresIn: number;
}

// Methods
// Set pasword of an user
UserSchema.methods.setPassword = function (
  iUser: IUser,
  password: string
) {
  iUser.salt = crypto.randomBytes(32).toString('hex');
  iUser.hash = crypto
    .pbkdf2Sync(password, iUser.salt, 10000, 64, 'sha512')
    .toString('hex');
};

// Check password of an user
UserSchema.methods.checkPassword = function (
  iUser: IUser,
  password: string
): boolean {
  const hash = crypto
    .pbkdf2Sync(password, iUser.salt, 10000, 64, 'sha512')
    .toString('hex');
  return iUser.hash === hash;
};

// Generate a JWT
UserSchema.methods.generateJwt = function (iUser: IUser): object {
  const expiresIn = 3600;

  const tokenPayload = {
    sub: iUser._id,
    iat: DateTime.local().toMillis(),
  };

  const tokenOptions = {
    algorithm: 'RS256',
    expiresIn,
    audience: 'https://affittagram.com',
  };

  const signedToken = jsonwebtoken.sign(
    tokenPayload,
    PRIVATE_KEY,
    tokenOptions
  );

  return {
    token: 'Bearer ' + signedToken,
    expiresIn,
  };
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
