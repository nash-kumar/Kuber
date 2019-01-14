const express = require("express");
const router = express.Router();
let path = require('path');
const api = require('../controllers/charity');
<<<<<<< HEAD


var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
=======
const multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './charityLogo');
        },
        filename: function (req, file, callback) {
            callback(null, new Data().toISOString() + file.originalname);
        }
    }),
    fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true)
        else cb(null, false)
>>>>>>> naresh_code
    }

uploads = multer({
    storage, limits: {
        fileSize: 1024 * 1024 * 5
    }, fileFilter
});



// Routes
router.get('/charitiesList', api.charitiesList);
router.get('/charityNearBy', api.charityLocation);
router.post('/addCharities', uploads.single('charityLogo'), api.addCharities);
router.get('/:id', api.charity_id);

module.exports = router;