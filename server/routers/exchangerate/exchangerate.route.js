const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");
//========================================================
// EXCHANGERATE
// CRUD

router.post("/register", auth, (req, res) => {
  require("./exchangerate").register(req, res);
});

router.put("/update", auth, (req, res) => {
  require("./exchangerate").update(req, res);
});

router.delete("/delete", auth, (req, res) => {
  require("./exchangerate").delete(req, res);
});

router.post("/getall", auth, (req, res) => {
  require("./exchangerate").getAll(req, res);
});

router.post("/get", auth, (req, res) => {
  require("./exchangerate").get(req, res);
});

router.post("/updateproductprices", auth, (req, res) => {
  require("./exchangerate").updateProductPrices(req, res);
});

//CURRENCY
router.put("/currencyupdate", auth, (req, res) => {
  require("./currency").currencyupdate(req, res);
});

router.post("/currencyget", auth, (req, res) => {
  require("./currency").currencyget(req, res);
});

module.exports = router;
