let userController = require('../controllers/userController');
let tagController = require('../controllers/tagController');
let receiptController = require('../controllers/receiptController');
var express = require('express');

var router = express.Router();

router.use('/user', userController);
router.use('/tags', tagController);
router.use('/receipts', receiptController);

module.exports = router;