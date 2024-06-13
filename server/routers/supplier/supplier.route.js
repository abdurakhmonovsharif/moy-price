const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth.middleware');
//========================================================
// SUPPLIER
// CRUD

router.post('/register', auth, (req, res) => {
  require('./supplier').register(req, res);
});

router.put('/update', auth, (req, res) => {
  require('./supplier').update(req, res);
});

router.post('/delete', auth, (req, res) => {
  require('./supplier').delete(req, res);
});

router.post('/getall', auth, (req, res) => {
  require('./supplier').getAll(req, res);
});

router.post('/getsuppliers', auth, (req, res) => {
  require('./supplier').getSuppliers(req, res);
});

router.post('/getsuppliersexcel', auth, (req, res) => {
  require('./supplier').getSuppliersExcel(req, res);
});

router.post('/getincoming', auth, (req, res) => {
  require('./supplier').getincoming(req, res);
});

router.post('/incomingsreport', auth, (req, res) => {
  require('./supplier').getSupplierReport(req, res);
});

module.exports = router;
