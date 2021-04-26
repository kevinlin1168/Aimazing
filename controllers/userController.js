var express = require('express');
var md5 = require('md5');
var db = require('../db');
var router = express.Router();


router.post('/signup', function (req, res) {
   let userName = req.body.userName;
   let password = req.body.password;
   try {
      result = db.execute(`SELECT name FROM users WHERE name = ${userName}`);
      console.log(result)
   } catch (error) {

   }
   res.json()
})

module.exports = router;