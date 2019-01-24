var cardModel = require('../model/card').cardModel;
var bankModel = require('../model/bank').bankModel;
const Error = require('../Error-Messages/paymentMessages');
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;


exports.payments = async (req, res) => {
    if (req.body.type == 'card') {
        cardModel.find({ userId:  encrypter.encrypt(req.user.id, keys) }, function (err, resultData) {
            for (var i = 0; i <= resultData.length; i++)
                if (i < resultData.length) {
                    if (encrypter.decrypt(resultData[i].cardNumber, keys) == req.body.cardNumber) {
                        return res.send({ message: Error.userExists })
                    }
                }
                else if (req.body) {
                    let userData = cardModel({
                        cardNumber: encrypter.encrypt (req.body.cardNumber,keys),
                        cardType: req.body.cardType,
                        expDate: req.body.expDate,
                        cardUserName: req.body.cardUserName,
                        default: req.body.default,
                        userId: encrypter.encrypt(req.user.id, keys)
                    });
                    userData.save((err, result) => {
                        if (err) {
                            res.status(500).send({ message: Error.Message500 });
                        } else if (result) {
                            const response = {
                                "cardNumber": result.cardNumber,
                                "cardUserName": result.cardUserName,
                                "expDate": result.expDate

                            }
                            return res.status(201).send({ message: Error.Message201, response });
                        }
                    });
                }
                else {
                    return res.status(400).json({ message: Error.Message400 });
                }
        })
    } else if (req.body.type == 'bank') {
        bankModel.find({ userId:  encrypter.encrypt(req.user.id, keys) }, function (err, resultData1) {
            for (var i = 0; i <= resultData1.length; i++)
                if (i < resultData1.length) {
                    if (encrypter.decrypt(resultData1[i].accountNumber, keys) == req.body.accountNumber) {
                        return res.send({ message: Error.userExists })
                    }
                }
                else if (req.body) {
                    let bankData = bankModel({
                        bankName: req.body.bankName,
                        routingNumber: encrypter.encrypt(req.body.routingNumber, keys),
                        accountNumber: encrypter.encrypt(req.body.accountNumber, keys),
                        accountHolderName: req.body.accountHolderName,
                        default: req.body.default,
                        userId:encrypter.encrypt(req.user.id,keys)
                    });
                    bankData.save((err, results) => {
                        if (err) {
                            res.status(500).send({ message: Error.Message500 });
                        } else if (results) {
                            const response = {
                                "bankName": results.bankName,
                                "routingNumber": results.routingNumber,
                                "accountNumber": results.accountNumber,
                                "accountHolderName": results.accountHolderName,
                            }
                            res.status(201).send({ message: Error.Message201, response });
                        } else console.log('erro');
                    });
                }
                else if (err) {
                    res.status(400).json({ message: Error.Message400 });
                }
                else {
                    res.status(400).json({ message: Error.Message400 });
                }
        })
    }
}


exports.Card_Get = (req, res) => {
    let query = cardModel.find({ userId: encrypter.encrypt(req.user.id, keys) }).select('-userId -__v -_id');
    query.exec()
        .then(docs => {
            let resData = [];

            docs.map(doc => {
                resData.push({ cardNumber: encrypter.decrypt(doc.cardNumber, keys) })
            })

            res.status(200).json({ message: Error.Message200, resData });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};


exports.Bank_Get = (req, res) => {
    let query = bankModel.find({ userId: encrypter.encrypt(req.user.id, keys) }).select('-userId -__v -_id');
    query.exec().then(docs => {
        let resData = [];

        docs.map(doc => {
            resData.push({ accountNumber: encrypter.decrypt(doc.accountNumber, keys) })
        })

        res.status(200).json({ message: Error.Message200, resData });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })
};