var cardModel = require('../model/card').cardModel;
var bankModel = require('../model/bank').bankModel;
const Error=require('../Error-Messages/paymentMessages');
var bcrypt = require('bcryptjs')
exports.payments = (req, res) => {
    if (req.body.type == 'card') {
      cardModel.find({$and :[{userId:req.userId , cardNumber:req.body.cardNumber}]}, function(err,resultData){
          if(resultData != 0){
              res.send({ message :Error.userExists})
          }
        else if (req.body) {
            let userData = cardModel({
                cardNumber: req.body.cardNumber,
                cardType: req.body.cardType,
                expDate: req.body.expDate,
                cardUserName: req.body.cardUserName,
                userId: req.userId
            });
            userData.save((err, result) => {
                if (err) {
                    res.status(500).send({ message: Error.Message500 });
                } else if (result) {
                    res.status(201).send({ message:Error.Message201, result });
                }
            });
        }
        else {
            res.status(400).json({ message:Error.Message400});
        }
   }) } else if (req.body.type == 'bank') {
    bankModel.find({$and :[{userId:req.userId , accountNumber:req.body.accountNumber}]}, function(err,resultData){
        if(resultData != 0){
            res.send({message :Error.userExists})
        }
        if (req.body) {
            let bankData = bankModel({
                bankName: req.body.bankName,
                routingNumber: req.body.routingNumber,
                accountNumber: req.body.accountNumber,
                accountHolderName: req.body.accountHolderName,
                userId: req.userId
            });
            bankData.save((err, results) => {
                if (err) {
                    res.status(500).send({ message:Error.Message500 });
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
    } ) } }


exports.Card_Get = (req, res) => {
    let query = cardModel.find({ userId: req.userId }).select('-userId -__v -_id');
    query.exec((err, result) => {
        if (err) {
            return res.send(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ message: Error.Message404 });
        } else {
            res.status(200).send({ message: Error.Message200 , result });
        }
    })
}

exports.Bank_Get = (req, res) => {
    let query = bankModel.find({ userId: req.userId }).select('-userId -__v -_id');
    query.exec((err, detail) => {
        if (err) {
            return res.send(err);
        }
        else if (detail.length === 0) {
            return res.status(404).send({ message:Error.Message404 });
        } else {
            res.status(200).send({ message:Error.Message200, detail});
        }
    })
}