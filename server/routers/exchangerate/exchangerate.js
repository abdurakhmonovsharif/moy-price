const { validateExchangerate } = require("../constants.js").validators;
const { map } = require("lodash");
const { Product, ProductPrice, Exchangerate, Market } =
  require("../constants.js").models;
const { roundToUzs } = require("../globalFunctions.js");
//Currency register

module.exports.register = async (req, res) => {
  try {
    const { error } = validateExchangerate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { exchangerate, market, isIncomingPrice, isSellingPrice } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    
    const products = await Product.find({ market });

    const newExchangerate = new Exchangerate({
      exchangerate,
      market,
    });
    await newExchangerate.save();

    if (isSellingPrice) {
      map(products, async (product) => {
        const price = await ProductPrice.findById(product.price);
        price.sellingpriceuzs = roundToUzs(
          price.sellingprice * newExchangerate.exchangerate
        );
        if (price.tradeprice) {
          price.tradepriceuzs = roundToUzs(
            price.tradeprice * newExchangerate.exchangerate
          );
        }
        await price.save();
      });
    }

    if (isIncomingPrice) {
      map(products, async (product) => {
        const price = await ProductPrice.findById(product.price);
        price.incomingpriceuzs = roundToUzs(
          price.incomingprice * newExchangerate.exchangerate
        );
        await price.save();
      });
    }

    res.send(newExchangerate);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.updateProductPrices = async (req, res) => {
  try {
    const { market } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res
        .status(400)
        .json({ message: "Do'kon ma'lumotlari topilmadi." });
    }

    const exchangerate = await Exchangerate.findOne({ market })
      .sort({
        _id: -1,
      })
      .select("exchangerate");
    const products = await Product.find({ market });

    map(products, async (product) => {
      const price = await ProductPrice.findById(product.price);
      price.sellingpriceuzs = roundToUzs(
        price.sellingprice * exchangerate.exchangerate
      );
      if (price.tradeprice) {
        price.tradepriceuzs = roundToUzs(
          price.tradeprice * exchangerate.exchangerate
        );
      }
      await price.save();
    });
    res.status(200).json({ message: "Mahsulot narxlari yangilandi." });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Currency update
module.exports.update = async (req, res) => {
  try {
    const { exchangerate, market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const exchangerat = await Exchangerate.findById(req.body._id);

    exchangerat.exchangerate = exchangerate;
    await exchangerat.save();

    res.send(exchangerat);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Currency update
module.exports.delete = async (req, res) => {
  try {
    const { _id } = req.body;

    const exchangerate = await Exchangerate.findByIdAndDelete(_id);

    res.send(exchangerate);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Currency getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const exchangerates = await Exchangerate.find({
      market,
    })
      .select("exchangerate createdAt market")
      .sort({ _id: -1 });

    res.send(exchangerates);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Currency get
module.exports.get = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const exchangerates = await Exchangerate.findOne({
      market,
    })
      .select("exchangerate")
      .sort({ _id: -1 });
    res.status(201).send(exchangerates);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
