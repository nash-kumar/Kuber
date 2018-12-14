const UserModel = require('../helpers/user.model'),
    Validators = require('../helpers/validators');

function profileUpdate(query, data, callback) {
    UserModel.findUserAndUpdate({ email: data.email}, data, (err, res) =>{
        if(err) callback(err, null)
        else if(res)callback(null, res)
        else callback(null, null)
    })
}

function profileImageUpload(query, data, callback){
    
}


module.exports = { profileUpdate, profileImageUpload}