var searchModule = require('../model/user.model').UserModel;

exports.search=(req,res)=>{
    var perPage = parseInt(req.query.perPage) || 2 
    var page = req.query.page || 1
    if(req.query.value) {
        const regex = new RegExp(escapeRegex(req.query.value), 'gi');
        searchModule.find({firstName: regex}, function(err, allCampgrounds){
            var count=allCampgrounds.length;
           if(err){
               res.send(err); 
           } else {
              if(allCampgrounds.length < 1) {
                  res.status(500).send({success:false, message:"user not found"});
              }
              else res.status(200).send({ message:"user found",allCampgrounds,count});
            
           }
        })
         .skip((page * perPage) - perPage)
        .limit(perPage)
        
    } 
        else {
           searchModule.find({}, function(err, allCampgrounds){
           if(err){
               res.status(404).send({success:false,message:"Cannot find"})
           } else {
            res.status(200).send({success:true,message:"all users", allCampgrounds})
           }
        });
    }
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};