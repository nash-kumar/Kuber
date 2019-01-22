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
var mailist =[
    'neha.n@accionlabs.com' ,'vinay.kashyap@accionlabs.com'
]
exports.help = (req, res) => {
    async.waterfall([
        function (done) {
            UserModel.findOne({ _id: req.userId }, function (err, user) {
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
                } user1 = user.email
                console.log(user1);
            })
        },
        function (Message, user, done) {
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

            var mailOptions = {
                to: Email,
                from: user1,
                subject: '[Kuber App]',
                cc: mailist,
                text: 'Hi ' + 'Vinay ' +

                    Message
            }; 
            smtpTransport.sendMail(mailOptions, function (err, team) {
                if (err) {
                    return res.status(500).json({ message: Error.message500 });
                } else {
                    return res.status(200).json({ message: Error.emailSent })
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
                        userId: encrypter.decrypt(doc.userId, keys)
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