var searchModule = require('../model/charities').CharityModel;
var error = require('../Error-Messages/message');
const encrypter = require('../helpers/validators');
let key = require('../config/keys');
const keys = key.key;
var moment = require('moment');

exports.search = ((req, res) => {
    var perPage = parseInt(req.query.perPage) || 3
    var page = req.query.page || 1
    var sort = { firstName: 1 }
    var searchFilter = {}
    if (req.body.key) {
        var charName = new RegExp(escapeRegex(req.body.key), 'gi');
        searchFilter.charityName = { $regex: charName };
    }
   
   
    searchModule.find(searchFilter, function (err, results) {        
        if (err) {
            res.status(404).send({ message: error.message404 })
        } else if (results.length < 1) {

            return res.status(500).send({ message: error.message500 })
        } else {
            var count = results.length;
            res.status(200).send({ message: error.message200, results, count })
        }
    }).skip((page * perPage) - perPage)
        .limit(perPage)
        .sort(sort)
}
)
function escapeRegex(text) {
    return text.replace(/[ -[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};