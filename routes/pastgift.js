let express = require('express');
let router = express.Router();
module.exports = router;
let pledge = require('../controllers/pledge')
let gift = require('../controllers/pastgift')
router.post('/gift', (req, res) =>{
    if(req.user) gift.gift(req, res)
});
router.get('/gift', (req,res)=>{
    if(req.user) gift.Get_gift(req,res);
});

router.post('/pledge', (req,res)=>{
 if(req.user) pledge.pledge(req,res);   
});