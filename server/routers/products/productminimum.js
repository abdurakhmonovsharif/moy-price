const { filter } = require('lodash');
const { Market } = require('../../models/MarketAndBranch/Market');
const { Product } = require('../../models/Products/Product');
require('../../models/Products/Category');
require('../../models/Products/Productdata');
require('../../models/Products/ProductPrice');

module.exports.getProductsMinimum = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }

    const products = await Product.find({ market })
      .select('-__v -updatedAt -isArchive')
      .populate('productdata', 'name code barcode')
      .populate('unit', 'name')
      .populate('category', 'name code')
      .populate(
        'price',
        'incomingprice incomingpriceuzs sellingprice sellingpriceuzs tradeprice tradepriceuzs '
      )
      .then((products) =>
        filter(
          products,
          (product) =>
            product.minimumcount && product.total < product.minimumcount
        )
      );

    res.status(200).json(products);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
