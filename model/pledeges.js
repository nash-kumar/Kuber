var mongoose=require('mongoose');

const pledgeSchema = mongoose.Schema({
    charityId :String,
    charityName :String,
    amount: Number,
    userId : String,
    paymentDate:Date,
    frequency:String,
    pledgeBit: Number
})
const pledge = mongoose.model('gift', pledgeSchema);

module.exports = {
    pledgeModel: pledge,
    pledgechema: pledgeSchema
}