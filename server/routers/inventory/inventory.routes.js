const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");

router.post("/getproducts", auth, (req, res) => {
  require("./inventory").getProductsInventory(req, res);
});

router.put("/update", auth, (req, res) => {
  require("./inventory").updateInventory(req, res);
});

router.post("/completed", auth, (req, res) => {
  require("./inventory").completed(req, res);
});

router.post("/connectors", auth, (req, res) => {
  require("./inventory").inventoryconnetors(req, res);
});

router.post("/inventories", auth, (req, res) => {
  require("./inventory").inventoryproducts(req, res);
});

module.exports = router;
