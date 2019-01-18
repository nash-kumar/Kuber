const mongoose = require("mongoose");
let path = require('path');
const Charity = require('../model/charities').CharityModel;
// const UserModel = require('../model/user.model').UserModel;
// const sortByDistance = require('sort-by-distance');

// get  charity api
function charitiesList(req, res, next) {
    var pageOptions = {
        page: Math.ceil(0, req.param('page')),
        limit: parseInt(req.query.limit) || 30
    }
    Charity.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .select()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                charity: docs.map(doc => {
                    return {
                        _id: doc._id,
                        charityName: doc.charityName,
                        rating: doc.rating,
                        description: doc.description,
                        charitylogo: doc.charitylogo,
                        latitude: doc.latitude,
                        longitude: doc.longitude,
                        return: {
                            type: 'GET'
                        }
                    }
                })
            }
            res.status(200).json({
                message: 'Get method success',
                response
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

// post api
function addCharities(req, res, next) {
    const charity = new Charity({
        _id: new mongoose.Types.ObjectId(),
        charityName: req.body.charityName,
        description: req.body.description,
        rating: req.body.rating,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        charitylogo: req.file.path
    });
    charity
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Charity Details uploded',
                createdCharity: {
                    _id: result._id,
                    charityName: result.charityName,
                    description: result.description,
                    rating: result.rating,
                    charitylogo: result.charitylogo,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    request: {
                        type: 'POST',
                        url: "http://localhost:3200/charities/" + result._id

                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// call by Id
function charity_id(req, res, next) {
    const id = req.params.id;
    const charity = new Charity({
        _id: new mongoose.Types.ObjectId(),
        charityName: req.body.charityName,
        description: req.body.description,
        rating: req.body.rating,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        charitylogo: req.file.path
    });
    charity.save()
    Charity.findById(id)
        .select('charityName rating description charitylogo')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    charity: doc
                });
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

function deleteCharity(req, res) {
    if (req.params.id) {
        Charity.findByIdAndDelete({ _id: req.params.id })
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(200).json({
                        'message': 'Deleted Successfully'
                    });
                } else {
                    res.status(404).json({ message: "No valid entry found for provided ID" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            })
    } else res.status(500).json({ error: err });
}

function editCharity(req, res) {
    const id = req.params.id;
    const charity = new Charity({

        charityName: req.body.charityName,
        description: req.body.description,
        rating: req.body.rating,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        charitylogo: req.file.path
    });
    charity
    if (req.params.id) {
        Charity.findOneAndUpdate({ _id: id }, charity)
            .exec()
            .then(charity => {
                if (charity) {
                    res.status(200).json({
                        charity,
                        'message': 'Updated Successfully'
                    });
                } else {
                    res.status(404).json({ message: "No valid entry found for provided ID" });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            })
    } else res.status(500).json({ error: err });
}

function charityLocation(callback) {
    Charity.find()
        .select()
        .exec()
        .then(docs => {
            const charity = docs.map(doc => {
                return {
                    id: doc.id,
                    charityName: doc.charityName,
                    rating: doc.rating,
                    description: doc.description,
                    charitylogo: doc.charitylogo,
                    latitude: doc.latitude,
                    longitude: doc.longitude,
                }
            })
            console.log("Charity Location: ", charity)
            callback(null, charity)
        }).catch(err => {
            callback(err, null)
        });
}

module.exports = { charityLocation, charitiesList, addCharities, editCharity, charity_id, deleteCharity };