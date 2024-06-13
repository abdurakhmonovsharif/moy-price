const {
  ProductPrice,
  validateProductPrice,
} = require('../../models/Products/ProductPrice');
const { Market } = require('../../models/MarketAndBranch/Market');
const { Product } = require('../../models/Products/Product');
const { ProductType } = require('../../models/Products/ProductType');

//ProductPrice register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateProductPrice(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { price, product, market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newProductPrice = new ProductPrice({
      product,
      price: Math.round(price * 10000) / 10000,
      market,
    });
    await newProductPrice.save();

    const produc = await Product.findByIdAndUpdate(product, {
      price: newProductPrice._id,
    });

    res.send(newProductPrice);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//ProductPrice update
module.exports.delete = async (req, res) => {
  try {
    const { _id } = req.body;

    const productprice = await ProductPrice.findByIdAndDelete(_id);

    const productprices = await ProductPrice.find({
      product: productprice.product,
    });

    const produc = await Product.findByIdAndUpdate(productprice.product, {
      price: productprices[productprices.length - 1],
    });

    res.send(productprice);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//ProductPrice getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const productprices = await ProductPrice.find({
      market,
    })
      .select('price product')
      .populate('product', 'name');

    res.send(productprices);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
