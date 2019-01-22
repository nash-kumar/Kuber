let express = require('express');
let router = express.Router();
module.exports = router;

let Api_Card = require('../controllers/card');


router.post('/payments', (req,res)=>{
if(req.user) Api_Card.payments(req,res);
});
router.get('/card/',(req,res)=>{
if(req.user) Api_Card.Card_Get(req,res)
});
router.get('/bank',(req,res)=>{
 if(req.user) Api_Card.Bank_Get (req,res);
});