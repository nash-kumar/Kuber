const AddressModel = require('../model/address.model').AddressModel;
const modelHelper = require('../helpers/modelHelper');
const userHelper = require('../controllers/user.controller');

function addAddress(query, data, callback) {
    modelHelper.addRecord(AddressModel, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) {
            data1.$push = { address: res.id }
            userHelper.profileUpdate(query, data1, (err, result) => {
                if (err) callback(err, null)
                else if (result) callback(null, result)
                else callback(null, null)
            })
        } else callback(null, null)
    })
}

module.exports = { addAddress }