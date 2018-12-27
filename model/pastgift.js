var mongoose=require('mongoose');

const pastGiftSchema = mongoose.Schema({
   charityId :String,
   charityName :String,
   amount: Number,
   userId : String,
   cardNumber: String,
   accountNumber:String,
   cardType:String,
   paymentDate:Date,
   bankType:String
})

const pastGifts = mongoose.model('gift', pastGiftSchema);

module.exports = {
    giftModel: pastGifts,
    pastGiftSchema: pastGiftSchema
}