var express = require('express');
var router = express.Router();

router.use('/authentication', require('./authentication/authentication'));
router.use('/user', require('./user/user'));

module.exports = router;
