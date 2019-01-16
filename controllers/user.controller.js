const UserModel = require('../helpers/user.model');
const bcrypt = require('bcrypt');
const Validators = require('../helpers/validators');


// const CharityModel = require('../model/charities');


function profileUpdate(query, data, callback) {
    UserModel.findUserAndUpdate(query, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
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
    }else callback(null, null)
}

function nearByCharities(callback) {
    UserModel.nearby((err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}

function profileImageUpload(query, data, callback) {
    UserModel.findUserAndUpdate(query, { profileImage: data }, (err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}


module.exports = { profileUpdate, profileImageUpload, nearByCharities, changePassword }