var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdwAuthentication = require('../middlewares/authentication');

var app = express();
var User = require('../models/user');


// ================================================================================
// GET ALL USERS
// ================================================================================
app.get('/', (request, response, next) => {

    User.find({}, 'id name email img role')
        .exec(

            (error, users) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Loading Users Error',
                        errors: error
                    });
                }

                response.status(200).json({
                    ok: true,
                    users: users
                });

            });

}); // app.get


// ================================================================================
// POST NEW USER
// ================================================================================
app.post('/', mdwAuthentication.verifyToken, (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    user.save((error, userSaved) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                message: 'User Save Error',
                errors: error
            });
        }

        // password mask
        userSaved.password = 'encrypted';

        res.status(201).json({
            ok: true,
            message: 'userSaved',
            userSaved: userSaved,
            userSavedBy: req.user
        });

    }); // user.save

}); // app.post


// ================================================================================
// UPDATE USER
// ================================================================================
app.put('/:id', mdwAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'User id (' + id + ') does not exists',
                errors: err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'User id (' + id + ') does not exists',
                errors: { message: 'User does not exist' }
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;
        user.password = bcrypt.hashSync(body.password, 10);

        user.save((err, userUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'User Update Error',
                    errors: err
                });
            }

            // password mask
            userUpdated.password = 'encrypted';

            res.status(200).json({
                ok: true,
                message: 'userUpdated',
                userUpdated: userUpdated,
                userUpdatedBy: req.user
            });

        }); //user.save

    }); // User.findById

}); // app.put


// ================================================================================
// DELETE USER
// ================================================================================
app.delete('/:id', mdwAuthentication.verifyToken, (req, res) => {

    var id = req.params.id;

    // res.status(200).json({
    //     ok: true,
    //     id: id
    // });

    User.findByIdAndRemove(id, (err, userDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'User Delete Error',
                errors: err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'User does not exists',
                errors: { message: 'User does not exists' }
            });
        }

        res.status(200).json({
            ok: true,
            message: 'userDeleted',
            userDeleted: userDeleted,
            userDeletedBy: req.user
        });

    });


});

module.exports = app;