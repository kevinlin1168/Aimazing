const e = require('express');
var express = require('express');
var md5 = require('md5');
var db = require('../db');
var router = express.Router();


router.post('/signup', async (req, res) => {
   let userName = req.body.userName;
   let password = req.body.password;
   try {
      result =await db.execute(`SELECT name FROM users WHERE name = '${userName}'`);
      if(result.length > 0) {
         res.json({
            "status": "error",
            "msg": "duplicate username"
         })
      } else {
         await db.execute(`INSERT INTO users (name, password) VALUES ('${userName}', '${md5(password)}')`)
         res.json({
            "status": "success",
            "msg": ""
         })
      }
   } catch (error) {
      res.json({
         "status": "error",
         "msg": error
      })
   }
})

module.exports = router;