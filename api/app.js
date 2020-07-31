const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');
require('./db');

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);

app.use(express.static(path.join(__dirname, '../dist/test')));

app.get('/*', function(req, res) {
  res.send(path.join(__dirname, '../dist/test/index.html'));
})

module.exports = app;
