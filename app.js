// use express method
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var rotues = require('./rotues');
app.set('secret', config.secret);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var db = require('./db');
db.initDB();

// check running enviroment
var port = process.env.PORT || 3000;

app.use('/', rotues);
// create
app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});