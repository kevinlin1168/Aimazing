let userController = require('../controllers/userController');
var express = require('express');

var router = express.Router();

router.use('/user', userController);

module.exports = router;