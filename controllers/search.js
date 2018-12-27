var searchModule = require('../model/pastgift').giftModel;
var error=require('../Error-Messages/message');
var moment = require('moment');

exports.search=((req,res)=>{
    var perPage = parseInt(req.query.perPage) || 2 
    var page = req.query.page || 1
    var sort = {firstName:1}
    var searchFilter = {}
    if(req.params.key) {
        var charName = new RegExp(escapeRegex(req.params.key), 'gi');
        searchFilter.charityName = { $regex : charName};
    }
    if(req.body.year) {      
        if(!moment(req.body.year, ['YYYY'], true).isValid()){
            return res.status(500).send({message:"Please pass proper search filter"});
        }
        let dateFilter = new Date();
        dateFilter.setFullYear(req.body.year);
        searchFilter.paymentDate = {$lt : dateFilter};
    }
    
    // if(req.params.key) {
    //      var regex = new RegExp(escapeRegex(req.params.key), 'gi');
    //      if(regex.source.length > 2)
    //     { searchModule.find({firstName: regex}, function(err, results){
    //         if(err){
    //             return res.status(500).send({message:error.message500}); 
    //         } else {
    //             if(results.length < 1) {
    //                 return res.status(500).send({message:error.message500});
    //             }
    //             else 
    //             var count=results.length;
    //             res.status(200).json({ message:error.message200,results,count});
    //           } 
    //         })
    //      .skip((page * perPage) - perPage)
    //      .limit(perPage)
    //      .sort(sort) } else {
    //          res.status(401).json({message:error.message401})
    //      }
        // } 
        // else {
            console.log(searchFilter);
           searchModule.find(searchFilter, function(err, results){
            var count=results.length;
           if(err){
               res.status(404).send({message:error.message404})
           } else {
            res.status(200).send({message:error.message200, results,count})
           }
        }).sort(sort);
    }
  )
function escapeRegex(text) {
    return text.replace(/[ -[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};