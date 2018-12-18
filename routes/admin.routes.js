const express = require('express'),
    router = express.Router(),
    resp = require('../helpers/responseHelpers'),
    AdminCtrl = require('../controllers/admin.controller');
// const CharityModel = require('../charity/charity.controller');
module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});


// router.post('/addCharity', (req, res) => {
//     if (req.body.charityData) {
//         CharityModel.addNewCharity(req.body.charityData, (err, doc) => {
//             if (err) resp.errorResponse(res, err, 501, 'Required Fields are missing!');
//             else if (doc) resp.successPostResponse(res, doc, 'Registered Successfully!');
//             else resp.missingBody(res, 'Missing body');
//         })
//     }else resp.errorResponse(res, err, 501, 'Error While Adding Charity!');
// })

router.post('/profileUpdate', (req, res) => {
    if (req.user) {
        AdminCtrl.profileUpdate(req.user, req.body, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
            else resp.noRecordsFound(res, `Unable To Update Data`);
        });
    } else resp.missingBody(res, "Missing Body");
});

router.get('/allProfile', (req, res) => {
    if (req) {
        AdminCtrl.findAllProfile((err, result) => {
            if (err) {
                resp.errorResponse(res, err, 502, `Error While Finding Data`);
            }
            else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
            else resp.noRecordsFound(res, `Unable To Update Data`);
        })
    }
})