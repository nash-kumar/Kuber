var cardModel = require('../model/card').cardModel;

exports.card = (req, res) => {
    if (req.body) {
        let userData = cardModel({
            cardNumber: req.body.cardNumber,
            cardType: req.body.cardType,
            userId: req.body.userId,
            expDate: req.body.expDate,
            cardUserName: req.body.cardUserName,
            // cvvCode: req.body.data.cvvCode
        });
        userData.save((err, result) => {
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "There should be a minimum or maximum of 16 numbers"
                });
            } else if (result) {
                res.status(201).send({ success: true, message: "Data added successfully", result });
            }
        });
    }
    else {
        res.status(400).json({
            message: 'Please Enter any DATA!'
        });
    }
};

exports.Card_Get = (req, res) => {
    let query = cardModel.find({ userId: req.params.id });
    query.exec((err, result) => {
        if (err) {
            return res.send(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ success: false, message: "Users Not Found" });
        } else {
            res.status(200).send({ success: true, message: "Succesfully fetched user details", result: result });
        }
    })
}