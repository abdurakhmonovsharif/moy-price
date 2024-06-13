const { Router } = require("express");
const router = Router();
const auth = require("../../middleware/auth.middleware");

// Markets
router.post("/getmarkets", auth, (req, res) => {
  require("./markets").getmarkets(req, res);
});

router.post("/getmarketcontrols", auth, (req, res) => {
  require("./markets").getmarketcontrols(req, res);
});

router.post("/updatemarkets", auth, (req, res) => {
  require("./markets").updatemarkets(req, res);
});

router.post("/delete", auth, (req, res) => {
  require("./markets").deletemarket(req, res);
});

// Persmission
router.post("/registerpermission", auth, (req, res) => {
  require("./permission").register(req, res);
});
router.post("/getpermission", auth, (req, res) => {
  require("./permission").get(req, res);
});

module.exports = router;
