let express = require('express');
let router = express.Router();
module.exports = router;

let gift= require('../controllers/pastgift')
let Auth = require('../middleware/check-auth')
router.post('/gift', Auth,gift.gift);
router.get('/gift',Auth,gift.Get_gift);
// router.get('/giftbank',Auth,gift.GetBank_gift);