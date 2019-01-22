var UserModel = require('../model/user.model').UserModel;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var Email = process.env.email;
var pass = process.env.password;
var service = process.env.service;
var refreshTokens = {};
const error=require('../Error-Messages/controllermessages')

exports.login = (req, res) => {
    UserModel.findOne({ email: req.body.data.email }, function (err, userInfo) {
        if (err) {
            next(err);
        } if (userInfo) {
            if (bcrypt.compareSync(req.body.data.password, userInfo.password)) {
                const token = jwt.sign({
                    _id: userInfo._id
                }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                const refreshToken = jwt.sign({
                    _id: userInfo._id
                }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                const response = {
                    "status": "Logged in",
                    "token": token,
                    "refreshToken": refreshToken,
                }
                refreshTokens[refreshToken] = response;
                res.status(200).json(response);
            } else {
                res.json({ success: false, message: "Invalid email/password!!!" });
            }
        }
        if (!userInfo) {
            res.json({ success: false, message: "Invalid email/password!!!" });
        }
    });
}
exports.token = (req, res) => {
    // refresh the token
    const postData = req.body
    if ((postData.refreshToken) && (postData.refreshToken in refreshTokens)) {
        const user = {
            "email": postData.email,
        }
        const token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "1d" })
        const response = {
            "token": token,
        }
        refreshTokens[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
}


exports.forgot_password = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            UserModel.findOne({ email: req.body.email },   function (err, user) {
                if (err) {
                    next(err);
                }
                else if (!user) {
                   res.status(400).json({ message:error.message400 });

                } else {
                    
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                }
            });
        },
        function (token, user, done) {
            res.json({ success: true });
            var smtpTransport = nodemailer.createTransport({
                service: service,
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: Email,
                    pass: pass
                }
            });
            name = user.firstName;
            nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
            var mailOptions = {
                to: req.body.email,
                from: Email,
                subject: '[Kuber App]',
                text: 'Hi ' + nameCapitalized + ',\n\n' +

                    'We recieved a request to reset your KuberApp password\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + 'localhost:4200/forgot' + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err, result) {
                if (err) {
                    res.status(500).json({ message:error.message500 });
                } else {
                    res.status(200).json({ message: error.emailSent })
                }
            });
        }
    ]);
}
exports.reset_get = (req, res) => {
    UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
                done(err, user);
            });
            return res.json({ message: error.Token });
        }
    });
};

exports.reset_password = (req, res) => {
    async.waterfall([
        function (done) {
            UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    UserModel.findOne({ resetPasswordToken: req.params.token }, function (err, user1) {
                        if (err) {
                            res.status(403).json({ message: error.message403 });
                        }
                        user1.resetPasswordToken = undefined;
                        user1.resetPasswordExpires = undefined;
                        user1.save(function (err) {
                            done(err, user1);
                        });
                        res.status(403).json({ message:error.Token });
                    })
                } else {
                    user.password = bcrypt.hashSync(req.body.password, saltRounds)
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        done(err, user);
                    });
                    user1 = user.email;
                    res.status(200).json({ message: error.update });
                }

            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: service,
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: Email,
                    pass: pass
                }
            });
            name = user.firstName;
            nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
            var mailOptions = {
                to: user1,
                from: Email,
                subject: '[Kuber App]',
                text: 'Hi ' + nameCapitalized + ',\n\n' +
                    'This is a confirmation that the password for your account ' + user1 + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err, result) {
                if (err) {
                    res.status(500).json({ message: error.message500 })
                } else {
                    res.status(200).json({ message: error.emailSent })
                }
            });
        }
    ]);
}