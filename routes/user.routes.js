const express = require('express'),
    router = express.Router(),
    UserCtrl = require('../controllers/user.controller'),
    resp = require('../helpers/responseHelpers');

module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user ) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});

router.patch('/profileUpdate', (req, res) => {
    if (req.user && req.user.query.role === 'user') {
        UserCtrl.profileUpdate(req.body.email, req.body, (err, res) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else resp.errorResponse(res, err, 502, `Error While Adding Data`);
            }
            else if (res) resp.successPostResponse(res, doc, `${role} Registered Succesfully`);
            else resp.noRecordsFound(res, `Unable To Update Data`);
        });
    } else resp.missingBody(res, "Missing Body");
});


