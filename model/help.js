var mongoose=require('mongoose');

const helpSchema = mongoose.Schema({
  helpMessage : {type : String},
  userId:String,
  Date:Date
})

const helps = mongoose.model('help', helpSchema);

module.exports = {  
   
    helpModel: helps,
    helpSchema: helpSchema
}