var mongoose=require('mongoose');

const CardSchema = mongoose.Schema({
    cardType:String,
    cardNumber:Number,
    userId:String,
    expDate:String,
    cardUserName:String,
    cvvCode:{type:Number, required:false}
});

// module.exports = mongoose.model('users', CardSchema);

const cards = mongoose.model('card', CardSchema);

module.exports = {
    cardModel: cards,
    CardSchema: CardSchema
}