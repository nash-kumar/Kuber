const pledgeModel = require('../model/pledeges').pledgeModel
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;


exports.pledge = (req, res) => {
    let pledgeData = pledgeModel({
        charityId: req.body.charityId,
        charityName: req.body.charityName,
        amount: req.body.amount,
        paymentDate: new Date(),
        frequency: req.body.frequency,
        pledgeBit: req.body.pledgeBit,
        userId: encrypter.encrypt(req.userId ,keys)
    });
    if (req.body.type === "card") {
        if (req.body.cardNumber == undefined) {
            return res.status(500).send({ message: Error.message500 });
        } else {
            pledgeData.cardNumber = encrypter.encrypt(req.body.cardNumber, keys)
            pledgeData.cardType = req.body.cardType
        }
    }
    else {
        pledgeData.accountNumber = encrypter.encrypt(req.body.accountNumber, keys)
        pledgeData.bankType = req.body.bankType
    }
    let cardData = pledgeModel(pledgeData);
    cardData.save((err, result) => {
        if (err) {
            return res.status(500).send({ message: Error.message500 });
        } else if (result) {
            const response = {
                charityId: result.charityId,
                charityName: result.charityName,
                cardType: result.cardType,
                bankType: result.bankType,
                amount: result.amount,
                frequency: result.frequency,
                paymentDate: result.paymentDate,
                accountNumber: result.accountNumber,
                cardNumber: result.cardNumber,
                pledgeBit: result.pledgeBit
            }

            return res.status(201).json({ message: Error.message201, response });
        } else res.status(400).json({ message: Error.Message400 });
    });

}




