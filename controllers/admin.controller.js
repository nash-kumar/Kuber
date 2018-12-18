const AdminModel = require('../helpers/admin.model');

function profileUpdate(query, data, callback) {
    AdminModel.findUserAndUpdate({ _id: query.id }, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}

function findAllProfile(callback) {
    AdminModel.findAll((err, res) => {
        if (err) callback(err, null)
        else if (res) callback(null, res)
        else callback(null, null)
    })
}


module.exports = { profileUpdate, findAllProfile }