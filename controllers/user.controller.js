const UserModel = require('../helpers/user.model');
   

function profileUpdate(query, data, callback) {
    UserModel.findUserAndUpdate(query, data, (err, res) => {
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


module.exports = { profileUpdate, profileImageUpload }