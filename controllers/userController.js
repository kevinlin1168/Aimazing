const e = require('express');
var express = require('express');
var md5 = require('md5');
var db = require('../db');
var router = express.Router();
var jwt = require('jsonwebtoken');

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

router.post('/login', async(req, res) => {
   let userName = req.body.userName;
   let password = req.body.password;
   try {
      result = await db.execute(`SELECT password FROM users WHERE name = '${userName}'`);
      if( result.length == 0) {
         res.json({
            "status": "error",
            "msg": "user name or password error"
         })
      } else {
         if (md5(password) != result[0].password) {
            res.json({
               "status": "error",
               "msg": "user name or password error"
            })
         } else {
            var token = jwt.sign({
               'userName': userName,
            }, req.app.settings.secret, {
               expiresIn: 60*60*24
            })

            res.json({
            success: true,
            msg: 'login success',
            token: token
            })
         }
      }
   } catch (error) {
      res.json({
         "status": "error",
         "msg": error
      })
   }
})

module.exports = router;