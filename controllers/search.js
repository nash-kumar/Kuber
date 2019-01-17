var searchModule = require('../model/pastgift').giftModel;
var error = require('../Error-Messages/message');
var moment = require('moment');

exports.search = ((req, res) => {
    var perPage = parseInt(req.query.perPage) || 3
    var page = req.query.page || 1
    var sort = { firstName: 1 }
    var searchFilter = {}
    if (req.params.key) {
        var charName = new RegExp(escapeRegex(req.params.key), 'gi');
        searchFilter.charityName = { $regex: charName };
    }
    if (req.body.year) {
        if (!moment(req.body.year, ['YYYY'], true).isValid()) {
            return res.status(500).send({ message: "Please pass proper search filter" });
        }
        let dateFilter = new Date();
        dateFilter.setFullYear(req.body.year);
        searchFilter.paymentDate = { $lt: dateFilter };
    }

    searchModule.find(searchFilter, function (err, results) {
        var count = results.length;
        if (err) {
            res.status(404).send({ message: error.message404 })
        } else if (results.length < 1) {

            return res.status(500).send({ message: error.message500 })
        } else {
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