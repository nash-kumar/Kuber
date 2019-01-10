const giftModel = require('../model/pastgift').giftModel;
const Error = require('../Error-Messages/message')
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;


exports.gift = (req, res, next) => {
    let giftObj = giftModel({
        charityId: req.body.charityId,
        charityName: req.body.charityName,
        amount: req.body.amount,
        paymentDate: new Date(),
        userId: encrypter.encrypt(req.userId,keys),
    })
    if (req.body.type == "card") {
        if(req.body.cardNumber == undefined){
           return res.status(500).send({ message:Error.message500});
        } else  { 
            giftObj.cardNumber = encrypter.encrypt(req.body.cardNumber, keys)
            giftObj.cardType = req.body.cardType } 
    }
    else {
        if(req.body.accountNumber == undefined){
            return res.status(500).send({ message:Error.message500});
         } else {
        giftObj.accountNumber = encrypter.encrypt(req.body.accountNumber,keys)
        giftObj.bankType = req.body.bankType }
    }
    let cardData = giftModel(giftObj);
    cardData.save((err, result) => {
        if (err) {
            return res.status(500).send({ message: Error.message500 });
        } else if(result){
            const response = {
                charityId: result.charityId,
                charityName: result.charityName,
                cardType: result.cardType,
                bankType: result.bankType,
                amount: result.amount,
                paymentDate: result.paymentDate,
                accountNumber: result.accountNumber,
                cardNumber: result.cardNumber
            }

            return res.status(201).json({ message: Error.message201, response });
        }else res.status(400).json({ message: Error.Message400 });
    });
}


exports.Get_gift = (req, res) => {
    let query = giftModel.find({ userId: encrypter.encrypt(req.userId,keys )});
    query.exec()
        .then(docs => {
            let resData = [];
            docs.map(doc => {
              if (doc.cardNumber) {
                    resData.push({
                        cardNumber: encrypter.decrypt(doc.cardNumber,keys),
                        charityName: doc.charityName,
                        amount: doc.amount,
                        cardType: doc.cardType,
                        paymentDate: doc.paymentDate
                    });                    
                    } else if(doc.accountNumber){
                resData.push({  
                    accountNumber: encrypter.decrypt(doc.accountNumber),
                    bankType:doc.bankType,
                    charityName: doc.charityName,
                    amount: doc.amount,
                    cardType: doc.cardType,
                    paymentDate: doc.paymentDate
                 }); 
                }
            });
            return (res.status(200).json({ message: Error.Message200, resData }));
        }).catch(err => {
          return (res.status(500).json({ message: Error.message500 }));
        })
}
