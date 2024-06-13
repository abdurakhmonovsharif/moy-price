const {
  Temporary,
  validateTemporary,
} = require("../../models/Sales/Temporary");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Category } = require("../../models/Products/Category");
const { ProductData } = require("../../models/Products/Productdata");
const {
  Product
} = require("../../models/Products/Product");
require("../../models/Users");

module.exports.register = async (req, res) => {
  try {
    const { temporary, market, user } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi.`,
      });
    }
    // console.log(market.brok);
    const newTemporary = new Temporary({
      temporary,
      market,
      user
    });
    await newTemporary.save();

    const temporaries = await Temporary.find({ market }).select(
      "temporary createdAt user"
    )
    .populate('user', 'firstname lastname')

    res.status(201).send(temporaries);
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon haqida malumotlari topilmadi!",
      });
    }

    const temporaries = await Temporary.find({ market }).select(
      "temporary createdAt user"
    )
    .populate('user', 'firstname lastname')
      .lean()

    for (const temp of temporaries) {
      for (const prod of temp.temporary.tableProducts) {
        if (Number(prod.fromFilial) === prod.filial !== market) {
          const filialCategory = await Category.findOne({
            code: prod.categorycode,
            market: prod.filial
          })
          const filialProductData = await ProductData.findOne({
            market: prod.filial,
            code: prod.product.code,
            category: filialCategory && filialCategory._id
          })
          if (filialProductData) {
            const product = await Product.findOne({
              market: prod.filial,
              productdata: filialProductData._id
            })
            prod.filialProductsTotal = product.total;
          }
        }
        const product = await Product.findById(prod.product._id)
        prod.total = product ? product.total : 0;
      }
    }

    res.status(201).send(temporaries);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: error.message, message: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getbById = async (req, res) => {
  try {
    const { market, temporaryId } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon haqida malumotlari topilmadi!",
      });
    }

    const temporary = await Temporary.findById(temporaryId).select("temporary user");

    res.status(201).send(temporary);
  } catch (error) {
    res.status(501).json({ error: error.message, message: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.deleteTemporary = async (req, res) => {
  try {
    const { _id, market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }

    await Temporary.findByIdAndDelete(_id);

    const temporaries = await Temporary.find({ market }).select(
      "temporary createdAt"
    );

    res.status(201).send(temporaries);
  } catch (error) {
    res.status(501).json({ error: error.message, message: "Serverda xatolik yuz berdi..." });
  }
};
