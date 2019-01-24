const helpModel = require('../model/help').helpModel;
const Error = require('../Error-Messages/message')
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;
const async = require('async');
const nodemailer = require('nodemailer');
const UserModel = require('../model/user.model').UserModel;
require('dotenv').config();
var Email = process.env.email;
var pass = process.env.password;
var service = process.env.service;
exports.help = (req, res) => {
    async.waterfall([
        function (done) {
            UserModel.findOne({ _id: req.user.id }, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    helpData = helpModel({
                        helpMessage: req.body.helpMessage,
                        userId: encrypter.encrypt(req.userId, keys),
                        Date: Date.now()
                    }); helpData.save(function (err, result) {
                        Message = result.helpMessage
                        done(err, Message)
                    })
                } user1 = user.firstName; user2 = user.lastName;

            })
        },
        function (Message, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: service,
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: Email,
                    pass: pass
                }
            });

            var mailOptions = {
                to: Email,
                from: Email,
                subject: '[Kuber App]',
                cc: key.mailList,
                text: 'Hi\n' +
                    Message + '\n\n' +
                    'Thank you \n' + 'Regards \n' + user1 + ' ' + user2
            };
            smtpTransport.sendMail(mailOptions, function (err, team) {
                if (err) {
                    return res.status(500).json({ message: Error.message500 });
                } else {
                    return res.status(200).json({ message: Error.message200 })
                }
            });
        }
    ])
}


exports.get_help = (req, res) => {
    let query = helpModel.find().select(' -__v ')
    query.exec()
        .then(docs => {
            const response = {
                FAQs: docs.map(doc => {
                    return {
                        helpMessage: doc.helpMessage,
                        userId: encrypter.decrypt(doc.user.id, keys)
                    }
                })
            }
            res.status(200).json({ message: Error.Message200, response });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: Error.message500
            });
        })
}