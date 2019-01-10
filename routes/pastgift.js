let express = require('express');
let router = express.Router();
module.exports = router;
let pledge = require('../controllers/pledge')
let gift = require('../controllers/pastgift')
let Auth = require('../middleware/check-auth')
router.post('/gift', Auth, gift.gift);
router.get('/gift', Auth, gift.Get_gift);

router.post('/pledge',Auth,pledge.pledge);