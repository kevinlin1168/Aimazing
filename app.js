// use express method
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var config = require('./config')
app.set('secret', config.secret)
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// check running enviroment
var port = process.env.PORT || 3000;

// require('./rotues')(app);
// create
app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});