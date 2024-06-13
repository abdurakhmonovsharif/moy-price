const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth.middleware');

router.post('/get', auth, (req, res) => {
  require('./expens').getExpense(req, res);
});

router.post('/register', auth, (req, res) => {
  require('./expens').registerExpense(req, res);
});

router.delete('/delete', auth, (req, res) => {
  require('./expens').deleteExpense(req, res);
});

module.exports = router;
