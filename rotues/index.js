let userController = require('../controllers/userController');
let tagController = require('../controllers/tagController');
var express = require('express');

var router = express.Router();

router.use('/user', userController);
router.use('/tags', tagController)

module.exports = router;