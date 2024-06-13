const { Router } = require('express');
const router = Router();
const auth = require('../../middleware/auth.middleware');

// Packman CRUD
router.post('/packman/register', auth, auth, (req, res) => {
  require('./packman').register(req, res);
});

router.post('/packman/getall', auth, (req, res) => {
  require('./packman').getAll(req, res);
});

router.put('/packman/update', (req, res) => {
  require('./packman').updatePackman(req, res);
});

router.delete('/packman/delete', auth, (req, res) => {
  require('./packman').deletePackman(req, res);
});

router.post('/packman/getpackmans', auth, (req, res) => {
  require('./packman').getPackmans(req, res);
});

// Client CRUD
router.post('/client/register', auth, (req, res) => {
  require('./client').register(req, res);
});

router.post('/client/getall', auth, (req, res) => {
  require('./client').getAll(req, res);
});

router.put('/client/update', auth, (req, res) => {
  require('./client').updateClient(req, res);
});

router.delete('/client/delete', auth, (req, res) => {
  require('./client').deleteClient(req, res);
});
router.post('/client/paymentDebt', auth, (req, res) => {
  require('./client').paymentDebt(req, res);
});

router.post('/client/getclients', auth, (req, res) => {
  require('./client').getClients(req, res);
});

router.post('/client/getclientssales', auth, (req, res) => {
  require('./client').getClientsSales(req, res);
});

// CRUD sale product
router.post('/saleproducts/register', auth, (req, res) => {
  require('./saleproduct').register(req, res);
});
router.delete('/saleproducts/delete', auth, (req, res) => {
  require('./saleproduct').deleteSale(req, res);
});
router.post('/saleproducts/addclient', auth, (req, res) => {
  require('./saleproduct').addClient(req, res);
});

router.post('/saleproducts/returnproducts', auth, (req, res) => {
  require('./saleproduct').registeredit(req, res);
});

router.post('/saleproducts/addproducts', auth, (req, res) => {
  require('./saleproduct').addproducts(req, res);
});

router.post('/saleproducts/checknumber', auth, (req, res) => {
  require('./saleproduct').check(req, res);
});

router.post('/saleproducts/getconnectors', auth, (req, res) => {
  require('./saleproduct').getsaleconnectors(req, res);
});

router.post('/saleproducts/getconnectorsexcel', auth, (req, res) => {
  require('./saleproduct').getsaleconnectorsexcel(req, res);
});

router.post('/saleproducts/payment', auth, (req, res) => {
  require('./saleproduct').payment(req, res);
});

router.post('/saleproducts/getreportproducts', auth, (req, res) => {
  require('./saleproduct').getreportproducts(req, res);
});

router.post('/saleproducts/getexcelreportproducts', auth, (req, res) => {
  require('./saleproduct').getexcelreportproducts(req, res);
});

// Discounts
router.post('/discounts/get', auth, (req, res) => {
  require('./discount').get(req, res);
});

router.post('/discounts/getexcel', auth, (req, res) => {
  require('./discount').getexcel(req, res);
});

// Payments
router.post('/payments/get', auth, (req, res) => {
  require('./payment').get(req, res);
});

router.post('/payments/getexcel', auth, (req, res) => {
  require('./payment').getexcel(req, res);
});

// Debt
router.post('/debts/get', auth, (req, res) => {
  require('./debt').get(req, res);
});

router.post('/payments/getexcel', auth, (req, res) => {
  require('./payment').getexcel(req, res);
});

//Temporary
router.post('/temporary/register', auth, (req, res) => {
  require('./temporary').register(req, res);
});

router.post('/temporary/get', auth, (req, res) => {
  require('./temporary').getAll(req, res);
});

router.post('/temporary/getbyid', auth, (req, res) => {
  require('./temporary').getbById(req, res);
});

router.post('/temporary/delete', auth, (req, res) => {
  require('./temporary').deleteTemporary(req, res);
});

// Seller Reports
router.post('/sellers/getreports', auth, (req, res) => {
  require('./sellersreport').getSellersReport(req, res);
});

router.post('/comment/update', auth, (req, res) => {
  require('./saleproduct').chnageComment(req, res);
})

module.exports = router;
