const express = require('express'),
    router = express.Router(),
    UserCtrl = require('../controllers/user.controller'),
    AuthCtrl = require('../controllers/authentication.controller');
resp = require('../helpers/responseHelpers'),
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

module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});

router.get('/userLocation', (req, res) => {
    if (req.user) {
        UserCtrl.nearByCharities({ latitude: req.user.location.latitude, longitude: req.user.location.longitude }, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
            else resp.noRecordsFound(res, `Unable To Update Data`);
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

router.post('/profileImage', uploads.single('profileImage'), (req, res) => {
    console.log(req.file);
    if (req.user) {
        UserCtrl.profileImageUpload(req.user.id, req.file.path, (err, result) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (result) resp.successPutResponse(res, result, 'Updated Successfullly');
            else resp.noRecordsFound(res, `Unable To Update Data`);
        })
    } else resp.missingBody(res, "Missing Body");
})
