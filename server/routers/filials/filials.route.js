const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");

//========================================================
// Products
router.post("/filials/getallfilials", auth, (req, res) => {
  require("./products").getAllFilials(req, res);
});

router.post("/register", auth, (req, res) => {
  require("./products").registerProducts(req, res);
});

router.post("/gettransfers", auth, (req, res) => {
  require("./products").getTransfers(req, res);
});

router.post("/getproducts", auth, (req, res) => {
  require("./products").getTransferProducts(req, res);
});

router.post("/getincomeproducts", auth, (req, res) => {
  require("./products").getIncomeProducts(req, res);
});

router.post("/getfilials", auth, (req, res) => {
  require("./products").getFilials(req, res);
});

router.put("/edit", auth, (req, res) => {
  require("./products").editTransfer(req, res);
});

router.delete("/delete", auth, (req, res) => {
  require("./products").deleteTransfer(req, res);
});

// Temporary
router.post("/temporary/register", auth, (req, res) => {
  require("./temporarytransfer").createTemporary(req, res);
});

router.post("/temporary/get", auth, (req, res) => {
  require("./temporarytransfer").getTemporary(req, res);
});

router.delete("/temporary/delete", auth, (req, res) => {
  require("./temporarytransfer").deleteTemporary(req, res);
});


router.post('/products/get', auth, (req, res) => {
  require('./products').filialProducts(req, res)
})

router.post('/warhouseproducts/get', auth, (req, res) => {
  require('./warhouse').getWarhouseTransferProducts(req, res);
})

router.post('/filialsforsale/get', auth, (req, res) => {
  require('./products').getFilialsForSale(req, res);
})

module.exports = router;
