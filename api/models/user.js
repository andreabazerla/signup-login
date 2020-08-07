const mongoose = require("mongoose");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  hash: String,
  salt: String,
  gender: Number,
  birthday: Date
});

userSchema.plugin(mongooseUniqueValidator);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
  var expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  return jsonwebtoken.sign(
    { _id: this._id },
    process.env.SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = mongoose.model("User", userSchema);
