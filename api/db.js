const mongoose = require('mongoose');
const app = require('./app');

var dbURI = 'mongodb://localhost/affittagram';

if (process.env.NODE_ENV === 'production')
  dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });
