const express = require("express");
const router = express.Router();
const multer = require('multer');
let path = require('path');
const api = require('../controllers/charity');


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "../images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

function filefliter(req, res, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        BaseAudioContext(null, false);
    }
}


var upload = multer({
    storage: Storage
});


// Routes
router.get('/charitiesList', api.charitiesList);
router.post('/addCharities', (upload.single('charitylogo')), api.addCharities);
router.get('/:id', api.charity_id);

module.exports = router;