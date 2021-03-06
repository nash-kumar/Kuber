const UserModel = require('../model/user.model').UserModel;
const CharityModel = require('../model/charities').CharityModel;
const UserModelHelper = require('../helpers/modelHelper');
const sortByDistance = require('sort-by-distance');

function signup(data, callback) {
    UserModelHelper.addRecord(UserModel, data, (err, res) => {
        if (err) {
            
            callback(err, null);
        } else if (res) {
            let resp = JSON.parse(JSON.stringify(res));
            if (delete resp.password) {
                
                callback(null, resp);
            } else callback(null, null);
        } else callback(null, null);
    });
}

function login(query, callback) {
    UserModelHelper.find(UserModel, { query }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            callback(null, res[0]);
        } else callback(null, null);
    });
}


function findUser(query, callback) {
    UserModelHelper.find(UserModel, { query, populateQuery: { path: "address" } }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            callback(null, res);
        } else callback(null, null);
    });
}


function findUserAndUpdate(query, data, callback) {
    UserModelHelper.update(UserModel, { query, update: data, options: { new: true, select: "-password" } }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res) {
            callback(null, res);
        } else callback(null, null);
    });
}


module.exports = { signup, login, findUser, findUserAndUpdate }