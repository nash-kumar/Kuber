const UserModel = require('../helpers/user.model');
// const CharityModel = require('../model/charities');
   

function profileUpdate(query, data, callback) {
    UserModel.findUserAndUpdate(query, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}

function nearByCharities(callback){
    UserModel.nearby((err, res) =>{
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}

function profileImageUpload(query, data, callback) {
    UserModel.findUserAndUpdate(query, {profileImage: data}, (err, res)=>{
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}


module.exports = { profileUpdate, profileImageUpload, nearByCharities }