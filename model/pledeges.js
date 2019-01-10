var mongoose=require('mongoose');

const pledgeSchema = mongoose.Schema({
        charityId :String,
        charityName :String,
        amount: Number,
        userId : String,
        paymentDate:Date,
        frequency:String,
        cardNumber: String,
        accountNumber:String,
        cardType:String,
        bankType:String,
        pledgeBit: {type :Boolean , default : null }
    })
const pledge = mongoose.model('pledges', pledgeSchema);

module.exports = {
    pledgeModel: pledge,
    pledgechema: pledgeSchema
}