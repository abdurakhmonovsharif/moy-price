const { filter } = require("lodash");
const { Market } = require("../../models/MarketAndBranch/Market");
const { User } = require("../../models/Users");
const { Currency } = require("../../models/Exchangerate/Currency.js");
const { Exchangerate } = require("../../models/Exchangerate/Exchangerate.js");
const { Expense } = require("../../models/Expense/Expense.js");
const { Inventory } = require("../../models/Inventory/Inventory.js");
const {
  InventoryConnector,
} = require("../../models/Inventory/InventoriesConnector.js");
const { Category } = require("../../models/Products/Category.js");
const { Incoming } = require("../../models/Products/Incoming.js");
const {
  IncomingConnector,
} = require("../../models/Products/IncomingConnector.js");
const {
  IncomingDailyConnector,
} = require("../../models/Products/IncomingDailyConnector.js");
const { IncomingPayment } = require("../../models/Products/IncomingPayment.js");
const { ProductData } = require("../../models/Products/Productdata.js");
const { ProductPrice } = require("../../models/Products/ProductPrice.js");
const {
  TemporaryIncoming,
} = require("../../models/Products/TemporaryIncoming.js");
const { Product } = require("../../models/Products/Product.js");
const { Unit } = require("../../models/Products/Unit.js");
const {
  DailySaleConnector,
} = require("../../models/Sales/DailySaleConnector.js");
const { Client } = require("../../models/Sales/Client.js");
const { Debt } = require("../../models/Sales/Debt.js");
const { Discount } = require("../../models/Sales/Discount.js");
const { Packman } = require("../../models/Sales/Packman.js");
const { Payment } = require("../../models/Sales/Payment.js");
const { SaleConnector } = require("../../models/Sales/SaleConnector.js");
const { SaleProduct } = require("../../models/Sales/SaleProduct.js");
const { Temporary } = require("../../models/Sales/Temporary.js");
const { Supplier } = require("../../models/Supplier/Supplier.js");
const { Template } = require("../../models/Templates/Template.js");
const { Transfer } = require("../../models/FilialProducts/Transfer.js");
const {
  TransferProduct,
} = require("../../models/FilialProducts/TransferProduct.js");
module.exports.getmarkets = async (req, res) => {
  try {
    const { administrator, currentPage, countPage, search } = req.body;
    const administration = await User.findById(administrator);

    if (!administration) {
      return res.status(400).json({
        message: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      });
    }

    const director = new RegExp(
      ".*" + search ? search.director : "" + ".*",
      "i"
    );
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");

    const markets = await Market.find({ name: name })
      .sort({ createdAt: -1 })
      .populate({
        path: "director",
        select: "firstname lastname phone image",
        match: { $or: [{ firstname: director }, { lastname: director }] },
      });

    let filtered = filter(markets, (market) => {
      return market.director !== null;
    });

    const count = filtered.length;
    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(200).json({
      markets: filtered,
      count,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getmarketcontrols = async (req, res) => {
  try {
    const { administrator, currentPage, countPage, search, marketId } =
      req.body;

    const administration = await User.findById(administrator);

    if (!administration) {
      return res.status(400).json({
        message: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      });
    }

    const director = new RegExp(
      ".*" + search ? search.director : "" + ".*",
      "i"
    );
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");

    const markets = await Market.find({ name: name, _id: { $ne: marketId } })
      .sort({ createdAt: -1 })
      .select("filials connections mainmarket image name phone1")
      .populate({
        path: "director",
        select: "firstname lastname",
        match: { $or: [{ firstname: director }, { lastname: director }] },
      });

    let filter = markets.filter((market) => {
      return market.director !== null;
    });

    const count = filter.length;

    const market = await Market.findById(marketId)
      .select("name filials connections phone1 phone2 phone3 permission")
      .populate("director", "firstname lastname phone");

    filter = filter.splice(currentPage * countPage, countPage);
    res.status(201).json({
      markets: filter,
      count,
      market,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.updatemarkets = async (req, res) => {
  try {
    const { administrator, currentPage, countPage, search, market, filial } =
      req.body;

    const administration = await User.findById(administrator);

    if (!administration) {
      return res.status(400).json({
        message: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      });
    }

    await Market.findByIdAndUpdate(market._id, { filials: market.filials });
    if (filial.mainmarket) {
      await Market.findByIdAndUpdate(filial._id, {
        mainmarket: filial.mainmarket
      });
    } else {
      await Market.findByIdAndUpdate(filial._id, {
        $unset: { mainmarket: 1 },
        filials: []
      });
    }

    for (const filial of market.filials) {
      const check = await Market.findById(filial)
      console.log(check); 
      if (check.mainmarket) {
        const filteredId = market.filials.filter(el => String(el) !== String(filial))
        await Market.findByIdAndUpdate(filial, {
          filials: [...filteredId, market._id]
        })
      } else {
        await Market.findByIdAndUpdate(filial, {
          filials: []
        }) 
      }
    }

    const director = new RegExp(
      ".*" + search ? search.director : "" + ".*",
      "i"
    );
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");

    const markets = await Market.find({ name: name, _id: { $ne: market._id } })
      .sort({ createdAt: -1 })
      .select("filials connections mainmarket image name phone1")
      .populate({
        path: "director",
        select: "firstname lastname",
        match: { $or: [{ firstname: director }, { lastname: director }] },
      });

    let filtered = filter(markets, (market) => {
      return market.director !== null;
    });

    const count = filtered.length;

    const marke = await Market.findById(market._id)
      .select("name filials connections")
      .populate("director", "firstname lastname phone");

    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(201).json({
      markets: filtered,
      count,
      market: marke,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.deletemarket = async (req, res) => {
  try {
    const { administrator, id } = req.body;
    const administration = await User.findById(administrator);

    if (!administration) {
      return res.status(400).json({
        message: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      });
    }

    await Currency.deleteMany({ market: id });
    await Exchangerate.deleteMany({ market: id });
    await Expense.deleteMany({ market: id });
    await Inventory.deleteMany({ market: id });
    await InventoryConnector.deleteMany({ market: id });
    await Category.deleteMany({ market: id });
    await Incoming.deleteMany({ market: id });
    await IncomingConnector.deleteMany({ market: id });
    await IncomingDailyConnector.deleteMany({ market: id });
    await IncomingPayment.deleteMany({ market: id });
    await Product.deleteMany({ market: id });
    await ProductData.deleteMany({ market: id });
    await ProductPrice.deleteMany({ market: id });
    await TemporaryIncoming.deleteMany({ market: id });
    await Unit.deleteMany({ market: id });
    await Client.deleteMany({ market: id });
    await DailySaleConnector.deleteMany({ market: id });
    await Debt.deleteMany({ market: id });
    await Discount.deleteMany({ market: id });
    await Packman.deleteMany({ market: id });
    await Payment.deleteMany({ market: id });
    await SaleConnector.deleteMany({ market: id });
    await SaleProduct.deleteMany({ market: id });
    await Temporary.deleteMany({ market: id });
    await Supplier.deleteMany({ market: id });
    await Template.deleteMany({ market: id });
    await User.deleteMany({ market: id });
    await IncomingPayment.deleteMany({ market: id });
    await Transfer.deleteMany({ market: id });
    await TransferProduct.deleteMany({ market: id });
    const deletedMarket = await Market.findByIdAndDelete(id);

    res.status(201).send(deletedMarket);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
