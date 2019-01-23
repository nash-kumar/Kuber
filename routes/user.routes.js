const express = require('express'),
    router = express.Router(),
    UserCtrl = require('../controllers/user.controller'),
    resp = require('../helpers/responseHelpers'),
    AddressCtrl = require('../controllers/address.controller'),
    validators = require('../helpers/validators');

module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});

router.get('/userLocation', (req, res) => {
    if (req.user) {
        UserCtrl.nearByCharities({ latitude: req.user.location.latitude, longitude: req.user.location.longitude, page: req.query.page }, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (result) {
                resp.successPutResponse(res, result, 'Updated Successfullly');
            }
            else resp.noRecordsFound(res, 'Page Not Found');
        });
    } else resp.missingBody(res, "Missing Body");
})

router.post('/profileUpdate/', (req, res) => {
    if (req.user) {
        UserCtrl.profileUpdate(req.user.id, req.body, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
            else resp.noRecordsFound(res, `Unable To Update Data`);
        });
    } else resp.missingBody(res, "Missing Body");
});

router.post('/changePassword', (req, res) => {
    if (req.user) {
        UserCtrl.changePassword(req.user, req.body, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            } else if (result) {
                resp.successPutResponse(res, result, 'Updated Successfullly');
            } else resp.noRecordsFound(res, `Unable To Update Data`);
        })
    } else resp.missingBody(res, "Missing Body");
})

router.post('/profileImage', (req, res) => {
    if (req.user) {
        validators.uploads.single('profileImage')(req, res, (err) => {
            if (err) resp.errorResponse(res, err, 501, "File too Large/Not a Image");
            else {
                if (req.user.profileImage !== null) validators.deteleFile(req.user.profileImage);
                UserCtrl.profileUpdate(req.user.id, { profileImage: req.file.path }, (err, result) => {
                    if (err) {
                        if (err && err.name === "MulterError") resp.errorResponse(res, err, 501, "File too Large");
                        else resp.errorResponse(res, err, 502, `Error While Adding Data`);
                    }
                    else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
                    else resp.noRecordsFound(res, `Unable To Update Data`);
                })

            }
        });
    } else resp.missingBody("Missing Body");
});

router.post('/address', (req, res) => {
    if (req.user) {
        AddressCtrl.addAddress(req.user.id, req.body, (err, address) => {
            if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
            else if (res) resp.successPutResponse(res, address, 'Updated Successfullly');
            else resp.noRecordsFound(res, 'Unknown Error');
        })
    } else resp.noRecordsFound(res, 'User not found');
})
