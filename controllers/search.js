var searchModule = require('../model/user.model').UserModel;
var error=require('../Error-Messages/message');

exports.search=(req,res)=>{
    var perPage = parseInt(req.query.perPage) || 2 
    var page = req.query.page || 1
    var sort = {firstName:1}
    if(req.query.value) {
         const regex = new RegExp(escapeRegex(req.query.value), 'gi');
         if(regex.source.length > 2)
        { searchModule.find({firstName: regex}, function(err, allCampgrounds){
              var count=allCampgrounds.length;
           if(err){
               res.send(err); 
           } else {
              if(allCampgrounds.length < 1) {
                  res.status(500).send({message:"No User"});
              }
              else 
                console.log(error.message200)
                res.status(200).json({ message:error.message200,allCampgrounds,count});
              }
            })
         .skip((page * perPage) - perPage)
         .limit(perPage)
         .sort(sort)} else {
             res.status(401).json({message:" enter more characters"})
         }
        } 
        else {
           searchModule.find({}, function(err, allCampgrounds){
            var count=allCampgrounds.length;
           if(err){
               res.status(404).send({success:false,message:"Cannot find"})
           } else {
            res.status(200).send({success:true,message:"all users", allCampgrounds,count})
           }
        }).sort(sort);
    }
}
function escapeRegex(text) {
    return text.replace(/[ -[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};