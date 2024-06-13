const { Market } = require("../../models/MarketAndBranch/Market");
const { Incoming } = require("../../models/Products/Incoming");
const { SaleProduct } = require("../../models/Sales/SaleProduct");
const { SaleConnector } = require("../../models/Sales/SaleConnector");
const { Expense } = require("../../models/Expense/Expense");
const { DailySaleConnector } = require("../../models/Sales/DailySaleConnector");
const { Discount } = require("../../models/Sales/Discount");
require("../../models/Sales/Payment");
require("../../models/Sales/Discount");
require("../../models/Products/ProductPrice");
const {
  reducer,
  roundToUzs,
  roundToUsd,
  reducerDuobleProperty,
} = require("../globalFunctions.js");

const { map, reduce } = require("lodash");

module.exports.getIncomingData = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
    }

    const startDate = new Date(
      new Date(new Date(new Date().setMonth(0)).setDate(1)).setHours(3, 0, 0, 0)
    );
    const currenDate = new Date();

    const incomings = await Incoming.find({
      market,
      createdAt: {
        $gte: startDate,
        $lte: currenDate,
      },
    }).select("totalprice market createdAt");

    res.status(201).json(incomings);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getSellingData = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
    }

    const startDate = new Date(
      new Date(new Date(new Date().setMonth(0)).setDate(1)).setHours(3, 0, 0, 0)
    );
    const currenDate = new Date();

    const selling = await SaleProduct.find({
      market,
      createdAt: {
        $gte: startDate,
        $lte: currenDate,
      },
    }).select("totalprice market createdAt");

    res.status(201).json(selling);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getSalesDataByMonth = async (req, res) => {
  try {
    const { market } = req.body;

    const sales = [];
    const salesSum = [];

    let count = 0;
    const currentMonth = new Date().getMonth();

    // Oylik soffoyda chiqarish
    let monthProfit = {
      usd: 0,
      uzs: 0,
    };
    while (count <= currentMonth) {
      const startDate = new Date(
        new Date(new Date().setMonth(count, 1)).setHours(0, 0, 0, 0)
      ).toISOString();
      const endDate = new Date(
        new Date(new Date().setMonth(count + 1, 1)).setHours(0, 0, 0, 0)
      ).toISOString();
      const dailysales = await DailySaleConnector.find({
        market,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("-isArchive -updatedAt -user -market -__v")
        .populate({
          path: "products",
          select: "pieces price totalprice totalpriceuzs",
          populate: {
            path: "price",
            select: "incomingprice incomingpriceuzs",
          },
        })
        .populate("discount", "discount discountuzs");

      const reduceData = (datas, propertys, property) =>
        reduce(
          datas,
          (summ, data) => summ + reducer(data[propertys], property),
          0
        );

      const reduceIncoming = (property) =>
        reduce(
          dailysales,
          (summ, dailysale) =>
            summ +
            reduce(
              dailysale.products,
              (summ, product) =>
                summ +
                ((product.price && product.price[property]) || 0) *
                  product.pieces,
              0
            ),
          0
        );

      const totalprice = roundToUsd(
        reduceData(dailysales, "products", "totalprice")
      );
      const totalpriceuzs = roundToUsd(
        reduceData(dailysales, "products", "totalpriceuzs")
      );

      sales.push(dailysales.length);
      salesSum.push({
        usd: totalprice,
        uzs: totalpriceuzs,
      });

      if (count === currentMonth) {
        const discounts = roundToUsd(
          reduceData(dailysales, "discount", "discount")
        );
        const discountsuzs = roundToUzs(
          reduceData(dailysales, "discount", "discountuzs")
        );

        const incomingprice = roundToUzs(reduceIncoming("incomingprice"));
        const incomingpriceuzs = roundToUzs(reduceIncoming("incomingpriceuzs"));

        monthProfit.uzs = roundToUzs(
          totalpriceuzs - incomingpriceuzs - discountsuzs
        );
        monthProfit.usd = roundToUsd(totalprice - incomingprice - discounts);
      }
      count++;
    }

    // Xarajat chiqarish bir oylik

    const expenses = await Expense.find({
      market,
      createdAt: {
        $gte: new Date(new Date().setDate(1)).toISOString(),
        $lte: new Date().toISOString(),
      },
    }).select("sum sumuzs");

    const monthExpense = {
      usd: roundToUsd(reducer(expenses, "sum")),
      uzs: roundToUzs(reducer(expenses, "sumuzs")),
    };

    res.status(200).json({
      sales,
      salesSum,
      monthProfit,
      monthExpense,
    });
  } catch (error) {
    res
      .status(501)
      .json({
        error: "Serverda xatolik yuz berdi...",
        description: error.message,
      });
  }
};
