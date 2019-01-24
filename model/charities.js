const mongoose = require('mongoose');

const charitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    charityName: { type: String, require: true },
    description: { type: String, require: true },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    latitude: { type: Number, require: true },
    longitude: { type: Number, require: true },
    charitylogo: { type: String, require: true }
});

const CharityModel = mongoose.model('Charity', charitySchema);
module.exports = { CharityModel };