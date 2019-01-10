var cardModel = require('../model/card').cardModel;
var bankModel = require('../model/bank').bankModel;
const Error=require('../Error-Messages/paymentMessages');
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;


exports.payments = async (req, res) => {
    if (req.body.type == 'card') {
      cardModel.find({userId:req.userId }, function(err,resultData){
          for(var i = 0; i <= resultData.length ;i ++)
          if(i < resultData.length){
                 if(encrypter.decrypt(resultData[i].cardNumber) == req.body.cardNumber){
                    return  res.send({ message :Error.userExists})}}
            else if (req.body) {
            let userData = cardModel({
                cardNumber: req.body.cardNumber,
                cardType: req.body.cardType,
                expDate: req.body.expDate,
                cardUserName: req.body.cardUserName,
                default:req.body.default,
                userId: encrypter.encrypt(req.userId,keys)
            });
            userData.save((err, result) => {
                if (err) {
                    res.status(500).send({ message: Error.Message500 });
                } else if (result) {
                     const response = {
                         "cardNumber":result.cardNumber,
                         "cardUserName":result.cardUserName,
                         "expDate":result.expDate

                     }
                  return  res.status(201).send({ message:Error.Message201, response });
                }
                  });
                }  
        else {
          return  res.status(400).json({ message:Error.Message400});
        }
     } ) } else if (req.body.type == 'bank') {
    bankModel.find({userId:req.userId}, function(err,resultData1){
        for(var i = 0; i<= resultData1.length ;i ++)
        if(i < resultData1.length){
               if(cryptr.decrypt(resultData1[i].accountNumber) == req.body.accountNumber){
                  return  res.send({ message :Error.userExists})}}
       else if (req.body) {
            let bankData = bankModel({
                bankName: req.body.bankName,
                routingNumber:cryptr.encrypt(req.body.routingNumber),
                accountNumber: cryptr.encrypt(req.body.accountNumber),
                accountHolderName: req.body.accountHolderName,
                default:req.body.default,
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
    query.exec()
    .then(docs => {
        const response = {
            cards:docs.map(doc => {
                return { cardNumber: cryptr.decrypt(doc.cardNumber)  }
            })
        }
        res.status(200).json({  message: Error.Message200,response });
  }) .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};
       

exports.Bank_Get = (req, res) => {
    let query = bankModel.find({ userId: req.userId }).select('-userId -__v -_id');
    query.exec()  .then(docs => {
        const response = {
            cards:docs.map(doc => {
                return { accountNumber: cryptr.decrypt(doc.accountNumber)  }
            })
        }
        res.status(200).json({  message: Error.Message200,response });
  }) .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    })
};