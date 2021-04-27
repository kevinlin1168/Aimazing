var express = require('express');
var jwt = require('jsonwebtoken');

tokenVerify = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token']
    if (token) {
        jwt.verify(token, req.app.settings.secret, function (err, decoded) {
        if (err) {
            return res.json({"status": "success", "msg": 'Failed to authenticate token.'})
        } else {
            req.decoded = decoded;
            next()
        }
        })
    } else {
        return res.status(403).send({
            "status": "error",
            "msg": 'No token provided.'
        })
    }
}

module.exports = {
    tokenVerifyMiddleware: tokenVerify
};