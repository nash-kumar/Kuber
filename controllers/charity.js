const mongoose = require("mongoose");
let path = require('path');
const Charity = require('../model/charities');
const UserModel = require('../model/user.model').UserModel;
const sortByDistance = require('sort-by-distance');

// get  charity api
exports.charitiesList = ((req, res, next) => {
    var pageOptions = {
        page: Math.ceil(0, req.param('page')),
        limit: parseInt(req.query.limit) || 30
    }
    Charity.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .select(" _id charityName description rating charitylogo ")
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
});

// post api
exports.addCharities = ((req, res, next) => {
    console.log(req.file);
    console.log('POST');
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
                    charitylogo : result.charitylogo,
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
});

// call by Id
exports.charity_id = ((req, res, next) => {
    const id = req.params.id;
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
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });



exports.charityLocation = ((req, res) => {
    var pageOptions = {
        page: Math.ceil(0, req.param('page')),
        limit: req.query.limit || 30
    }
    Charity.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .select("latitiude longitude")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                charity: docs.map(doc => {
                    return {
                        latitude: doc.latitude,
                        longitude: doc.longitude
                    }
                })
            }
            res.status(200).json({
                message: 'Get method success',
                response
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})