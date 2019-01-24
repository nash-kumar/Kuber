const AddressModel = require('../model/address.model').AddressModel;
const modelHelper = require('../helpers/modelHelper');
const userHelper = require('../controllers/user.controller');

function addAddress(query, data, callback) {
    modelHelper.addRecord(AddressModel, data, (err, res) => {
        if (err) callback(err, null)
        else if (res) {
            userHelper.profileUpdate({ _id: query }, { $push: { address: res.id } }, (err, result) => {
                if (err) callback(err, null)
                else if (result) callback(null, result)
                else callback(null, null)
            })
        } else callback(null, null)
    })
}

function editAddress(query, data, callback) {
    modelHelper.update(AddressModel, Charity, { query, update: data, options: { new: true } }, (err, edited) => {
        if(err) callback(err, nul)
        else if(edited) callback(null, edited)
        else callback(null, null)
    })
}

module.exports = { addAddress, editAddress }