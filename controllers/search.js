var searchModule = require('../model/user.model').UserModel;
var error=require('../Error-Messages/message');

exports.search=((req,res)=>{
    var perPage = parseInt(req.query.perPage) || 2 
    var page = req.query.page || 1
    var sort = {firstName:1}
    if(req.query.value) {
         var regex = new RegExp(escapeRegex(req.query.value), 'gi');
         if(regex.source.length > 2)
        { searchModule.find({firstName: regex}, function(err, results){
            if(err){
                res.status(500).send({message:error.message500}); 
            } else {
                if(results.length < 1) {
                    return res.status(500).send({message:error.message500});
                }
                else 
                var count=results.length;
                res.status(200).json({ message:error.message200,results,count});
              }
            })
         .skip((page * perPage) - perPage)
         .limit(perPage)
         .sort(sort) } else {
             res.status(401).json({message:error.message401})
         }
        } 
        else {
           searchModule.find({}, function(err, results){
            var count=results.length;
           if(err){
               res.status(404).send({message:error.message404})
           } else {
            res.status(200).send({message:error.message200, results,count})
           }
        }).sort(sort);
    }
  })
function escapeRegex(text) {
    return text.replace(/[ -[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};