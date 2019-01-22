const UserModel = require('../helpers/user.model');
const CharityModel = require('../controllers/charity');
const bcrypt = require('bcrypt');
const Validators = require('../helpers/validators');
const sortByDistance = require('sort-by-distance');

function profileUpdate(query, data, callback) {
    UserModel.findUserAndUpdate(query, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}

function imageUpload(req, res, callback) {
    Validators.uploads(req, res, (err) => {
        if (err) callback(err, null);
        else if (req.user) callback(null, res);
        else callback(null, null)
    })
}

function changePassword(query, data, callback) {
    if (data.currentPassword) {
        bcrypt.compare(data.currentPassword, query.password, (err, same) => {
            if (err) callback(err, null);
            else if (same) {
                Validators.hashPassword(data.password, (err, hash) => {
                    if (err) callback(err, null)
                    else if (hash) {
                        data.password = hash
                        UserModel.findUserAndUpdate(query.id, data, (err, res) => {
                            if (err) callback(err, null)
                            else if (res) callback(null, res)
                            else callback(null, null)
                        })
                    }
                })
            } else callback(null, null);
        })
    } else callback(null, null)
}

function nearByCharities(data, callback) {
    CharityModel.charityLocation((err, location) => {
        if (err) callback(err, null)
        else if (location) {
            const origin = {
                longitude: data.longitude,
                latitude: data.latitude
            }
            const opts = {
                yName: 'latitude',
                xName: 'longitude'
            }
            const value = (sortByDistance(origin, location, opts));

            var pageValue = Validators.Pagination(value, data.page);
            callback(null, pageValue);  
        } else callback(null, null)
    })
}



module.exports = { profileUpdate, nearByCharities, changePassword, imageUpload }