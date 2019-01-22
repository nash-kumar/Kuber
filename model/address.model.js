const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const AddressSchema = new Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: null },
    zipCode: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
});

const AddressModel = mongoose.model('address', AddressSchema);
module.exports = { AddressModel };