var mongoose=require('mongoose');

const CardSchema = mongoose.Schema({
    cardType:String,
    cardNumber:String,
    userId:String,
    expDate:String,
    cardUserName:String,
    default:Boolean,
});
const cards = mongoose.model('card', CardSchema);

module.exports = {
    cardModel: cards,
    CardSchema: CardSchema
}