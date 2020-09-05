import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as jsonwebtoken from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
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
  },
  hash: String,
  salt: String,
  gender: {
    type: Number,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
});

userSchema.methods.setPassword = function(password: crypto.BinaryLike): void {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validPassword = function(password: crypto.BinaryLike): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = () => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  return jsonwebtoken.sign({ _id: this._id }, process.env.SECRET, {
    expiresIn: '1h',
  });
};

const User = mongoose.model('User', userSchema);

export default User;
