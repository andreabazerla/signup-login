const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

// Configurations
require('./db');
require('./configuration/passport');

var app = express();

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport.js
app.use(passport.initialize());

// Routes
const routes = require('./routes/index');
app.use('/api', routes);

// Static files
app.use(express.static(path.join(__dirname, '../dist/affittagram')));

app.get('/*', function(req, res) {
  res.send(path.join(__dirname, '../dist/affittagram/index.html'));
})

module.exports = app;
