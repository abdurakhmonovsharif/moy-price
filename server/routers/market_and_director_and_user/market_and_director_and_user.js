const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth.middleware');

//========================================================
// Market
router.post('/market/register', (req, res) => {
  require('./market.route').register(req, res);
});

router.put('/market/edit', (req, res) => {
  require('./market.route').edit(req, res);
});

router.post('/market', (req, res) => {
  require('./market.route').getMarket(req, res);
});

router.post('/market/getsmsApiKey', (req, res) => {
  require('./market.route').getSmsApi(req, res);
});
router.post('/market/getsmsApiKey/create_update', (req, res) => {
  require('./market.route').createAndUpdateSmsApiKey(req, res);
});
//========================================================
// Branch
router.post('/branch/register', auth, (req, res) => {
  require('./branch.route').register(req, res);
});

router.put('/branch/update', auth, (req, res) => {
  require('./branch.route').update(req, res);
});

router.delete('/branch/delete', auth, (req, res) => {
  require('./branch.route').delete(req, res);
});

router.post('/branch/getall', auth, (req, res) => {
  require('./branch.route').getBranch(req, res);
});

router.post('/branch/registerdirector', auth, (req, res) => {
  require('./branch.route').registerBranchDirector(req, res);
});

//========================================================
//Director
// router.post('/director/register', (req, res) => {
//   require('./director.route').register(req, res)
// })

router.post('/director/login', (req, res) => {
  require('./director.route').login(req, res);
});

router.post('/director', (req, res) => {
  require('./director.route').getDirector(req, res);
});

router.put('/director/update', (req, res) => {
  require('./director.route').update(req, res);
});

router.put('/director/updatepassword', (req, res) => {
  require('./director.route').updatePassword(req, res);
});

//========================================================
//Administrator
router.post('/admin/register', (req, res) => {
  require('./user.route').registerAdmin(req, res);
});

//========================================================
//User
router.post('/user/register', auth, (req, res) => {
  require('./user.route').register(req, res);
});

router.post('/user/edit', auth, (req, res) => {
  require('./user.route').editUser(req, res);
});

router.post('/director/register', (req, res) => {
  require('./user.route').registerDirector(req, res);
});

router.post('/user/login', (req, res) => {
  require('./user.route').login(req, res);
});

router.post('/user/gettype', auth, (req, res) => {
  require('./user.route').getUserType(req, res);
});

router.post('/user/getall', auth, (req, res) => {
  require('./user.route').getUsers(req, res);
});

router.post('/user/remove', auth, (req, res) => {
  require('./user.route').removeUser(req, res);
});

router.post('/user', auth, (req, res) => {
  require('./user.route').getUser(req, res);
});

router.post('/user/createseller', auth, (req, res) => {
  require('./user.route').createseller(req, res);
});

router.post('/user/getsellers', auth, (req, res) => {
  require('./user.route').getsellers(req, res);
});

router.post('/qrcode/create', auth, (req, res) => {
  require('./market.route').createQrcode(req, res);
});

router.post('/qrcode/delete', auth, (req, res) => {
  require('./market.route').deleteQrcode(req, res);
});

module.exports = router;
