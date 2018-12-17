var mongoose=require('mongoose');

const bankSchema = mongoose.Schema({
    bankName:String,
    routingNumber:Number,
    accountNumber:Number,
    accountHolderName:String,
    userId:String
});
const banks = mongoose.model('bank', bankSchema);

module.exports = {
    bankModel: banks,
    bankSchema: bankSchema
}