var mongoose=require('mongoose');

const bankSchema = mongoose.Schema({
    bankName:String,
    routingNumber:String,
    accountNumber:String,
    accountHolderName:String,
    default:Boolean,
    userId:String
});
const banks = mongoose.model('bank', bankSchema);

module.exports = {
    bankModel: banks,
    bankSchema: bankSchema
}