const { Market } = require("../../models/MarketAndBranch/Market");
const { Product } = require("../../models/Products/Product");
const { ProductPrice } = require("../../models/Products/ProductPrice");

module.exports.getfilials = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    let filials = [];

    for (const f of marke.filials) {
      const products = await Product.find({ market: f })
        .select("price total")
        .populate("price", "incomingprice");

      const totalprice = products.reduce((summ, product) => {
        return summ + product.total * product.price.incomingprice;
      }, 0);

      const pieces = products.reduce((summ, product) => {
        return summ + product.total;
      }, 0);

      const count = products.length;

      const market = await Market.findById(f)
        .select("name phone1")
        .populate("director", "firstname lastname");

      const filial = {
        market,
        count,
        pieces,
        totalprice,
      };

      filials.push(filial);
    }
    res.status(201).send(filials);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
