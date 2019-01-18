const express = require("express");
const router = express.Router();
let path = require('path');

const api = require('../controllers/charity'),
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './images');
        },
        filename: function (req, file, callback) {
            callback(null, new Date().toISOString() + file.originalname);
        }
    }),

    fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true)
        else cb(null, false)
    }

uploads = multer({
    storage, limits: {
        fileSize: 1024 * 1024 * 5
    }, fileFilter
});


// Routes
router.get('/charitiesList', api.charitiesList);
router.post('/addCharities', (uploads.single('charitylogo')), api.addCharities);
router.get('/getCharityById/:id', api.charity_id);
router.post('/updateCharity/:id', (uploads.single('charitylogo')), api.editCharity);
router.delete('/deleted/:id', api.deleteCharity);

module.exports = router;