const express = require("express");
const router = express.Router();
let path = require('path');
const helper = require('../helpers/validators'),
    resp = require('../helpers/responseHelpers'),
    api = require('../controllers/charity');

// Routes
router.get('/charitiesList', api.charitiesList);
router.post('/addCharities', (req, res) => {
    helper.uploads.single('charitylogo')(req, res, (err) => {
        if (err) resp.errorResponse(res, err, 400, 'File too large/ Not an Image');
        else {
            api.addCharities(req, res);
        }
    })
});
router.get('/getCharityById/:id', api.charity_id);
router.post('/updateCharity/:id', (helper.uploads.single('charitylogo')), api.editCharity);
router.delete('/deleted/:id', api.deleteCharity);

module.exports = router;