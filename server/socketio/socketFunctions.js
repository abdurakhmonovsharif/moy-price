const { Market } = require("../models/MarketAndBranch/Market.js");
const { Product } = require("../models/Products/Product.js");
const { ProductData } = require("../models/Products/Productdata.js");
const { Category } = require("../models/Products/Category.js");
const { Unit } = require("../models/Products/Unit.js");
const { ProductPrice } = require("../models/Products/ProductPrice.js");
const { User } = require("../models/Users.js");
const { map, reduce } = require("lodash");

const convertToUsd = (value) => Math.round(value * 1000) / 1000;
const convertToUzs = (value) => Math.round(value);

const getProductsByCount = async ({ socket, market }) => {
  try {
    const marke = await Market.findById(market);
    if (!marke) {
      return socket.emit("error", {
        id: market,
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const categories = await Category.find(
      { market },
      { timestamp: 1, code: 1, name: 1, products: 1 }
    )
      .sort({ code: 1 })
      .select("_id");

    socket.emit("categories", { id: market, categories });

    for (const category of categories) {
      const products = await Product.find(
        { market, category, isArchive: false },
        { timestamp: 1 }
      )
        .sort({ timestamp: -1 })
        .select("market total productdata price category unit width")
        .populate("productdata", "name code barcode")
        .populate(
          "price",
          "sellingprice incomingprice sellingpriceuzs incomingpriceuzs tradeprice tradepriceuzs"
        )
        .populate("category", "name code")
        .populate("unit", "name")
        .lean()
        .then(products => products.sort((a, b) => Number(a.productdata.code) - Number(b.productdata.code)))
      socket.emit("getProductsOfCount", { id: market, products });
    }
  } catch (error) {
    return socket.emit("error", {
      id: market,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

const getAllFilials = async ({ socket, market }) => {
  try {
    const marke = await Market.findById(market);
    if (!marke) {
      return socket.emit("error", {
        id: market,
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    let filials = []

    const f = await Market.findOne({ _id: market }, { timestamp: 1 })
      .populate({
        path: "filials",
        select: "director image name phone1 createdAt",
        populate: {
          path: "director",
          select: "firstname lastname",
        }
      })
      .lean()

      filials = f.filials

    const all = [];
    for (const i in filials) {
      const products = await Product.find({ market: filials[i]._id, isArchive: false })
        .select("total price")
        .populate("price", "incomingpriceuzs incomingprice")
        .then((products) => {
          const totalPrice = reduce(
            products,
            (summ, product) =>
              summ + product.price.incomingprice * product.total,
            0
          );
          const totalPriceuzs = reduce(
            products,
            (summ, product) =>
              summ + product.price.incomingpriceuzs * product.total,
            0
          );
          return {
            totalPrice: convertToUsd(totalPrice),
            totalPriceuzs: convertToUzs(totalPriceuzs),
          };
        });
      const productCount = await Product.find({
        market: filials[i]._id,
      }).count();
      const productCategory = await Category.find({
        market: filials[i]._id,
      }).count();
      all.push({
        products,
        productCategory,
        productCount,
        _id: filials[i]._id,
        name: filials[i].name,
        image: filials[i].image,
        phone1: filials[i].phone1,
        createdAt: filials[i].createdAt,
        director: filials[i].director,
      });
    }

    return socket.emit("getAllFilials", { id: market, filials: all });
  } catch (error) {
    return socket.emit("error", {
      id: market,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

const getPartnerProducts = async ({ socket, market, partner }) => {
  try {
    const marke = await Market.findById(market);
    if (!marke) {
      return socket.emit("error", {
        id: market,
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const categories = await Category.find(
      { market: partner, connections: market },

      { timestamp: 1, code: 1, name: 1, products: 1 }
    )
      .sort({ code: 1 })
      .select("_id");
    socket.emit("partnerCategories", { id: market, categories });
    for (const category of categories) {
      const products = await Product.find(
        { market: partner, category, connections: market, isArchive: false },
        { timestamp: 1 }
      )
        .sort({ timestamp: -1 })
        .select("market total productdata price category unit")
        .populate("productdata", "name code barcode")
        .populate(
          "price",
          "sellingprice incomingprice sellingpriceuzs incomingpriceuzs tradeprice tradepriceuzs"
        )
        .populate("category", "name code")
        .populate("unit", "name");
      socket.emit("setPartnerProducts", { id: market, products });
    }
    socket.emit("partnerCategories", { id: market, categories });
  } catch (error) {
    return socket.emit("error", {
      id: market,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

module.exports = {
  getProductsByCount,
  getAllFilials,
  getPartnerProducts,
};
