let express = require('express');
let router = express.Router();

module.exports = router;

let Api = require('../controllers/controllers');
let API_SEARCH = require('../controllers/search');
let API_Help = require('../controllers/help');
let API_SEARCH_PLEDGE = require('../controllers/search1');
let API_SEARCH_DASHBOARD = require('../controllers/search2')

router.post('/login', Api.login);
router.post('/forgot', Api.forgot_password);
router.get('/reset/:token', Api.reset_get);
router.post('/reset/:token', Api.reset_password);
router.post('/token', Api.token);

router.post('/search/', (req, res) => {
   if (req.user) API_SEARCH.search(req, res)
});
router.post('/searchDashboard/', (req, res) => {
   if (req.user) API_SEARCH_DASHBOARD.search(req, res)
});
router.post('/searchPledge/', (req, res) => {
   if (req.user) API_SEARCH_PLEDGE.search(req, res)
});
router.post('/help', (req, res) => {
   if (req.user) API_Help.help(req, res)
});

router.get('/help', (req, res) => {
   if (req.user) API_Help.get_help(req, res);
});