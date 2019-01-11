var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var User = require('../models/user');

var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'User Login Error',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Wrong Credentials - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Wrong Credentials - password',
                errors: err
            });
        }

        // User is Valid
        // Create User Token

        // user password
        userDB.password = 'encrypted'

        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: userDB,
            id: userDB.id,
            token: token
        });

    });



});

module.exports = app;