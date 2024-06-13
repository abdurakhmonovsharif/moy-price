const { Client, validateClient } = require("../../models/Sales/Client.js");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Packman } = require("../../models/Sales/Packman.js");
const { SaleConnector } = require("../../models/Sales/SaleConnector");
require("../../models/Sales/SaleProduct");
require("../../models/Sales/Packman");
const { Payment } = require("../../models/Sales/Payment");
require("../../models/Sales/Discount");
require("../../models/Sales/Debt");
require("../../models/Sales/DailySaleConnector");
require("../../models/Products/Productdata");
require("../../models/Products/Product");
require("../../models/Users");
const { filter } = require("lodash/collection.js");
const { regExpression } = require("../globalFunctions.js");
const { DailySaleConnector } = require("../../models/Sales/DailySaleConnector");
const { Debt } = require("../../models/Sales/Debt");

module.exports.register = async (req, res) => {
  try {
    const { name,phoneNumber, market, packman, search, currentPage, countPage } = req.body;
    const { error } = validateClient({ name,phoneNumber, market });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi.`,
      });
    }

    const client = await Client.findOne({
      name,
      market,
    });

    if (client) {
      return res.status(400).json({
        message: `Diqqat! ${name} mijoz avval yaratilgan!`,
      });
    }

    const newClient = new Client({
      name,
      market,
      phoneNumber
    });
    await newClient.save();

    if (packman) {
      const checkpackman = await Packman.findById(packman);
      if (checkpackman) {
        newClient.packman = checkpackman._id;
        await Packman.findByIdAndUpdate(checkpackman._id, {
          $push: {
            clients: newClient,
          },
        });
        await newClient.save();
      }
    }
    const clientname = new RegExp(
      ".*" + search ? search.client : "" + ".*",
      "i"
    );
    const clientpackman = new RegExp(
      ".*" + search ? search.packman : "" + ".*",
      "i"
    );

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } })
      .populate("packman", "name")
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(400).json({ error: "Serverda xatolik yuz berdi..." });
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

    const clients = await Client.find({ market })
      .select("name phoneNumber")
      .populate("packman", "name")
      .lean();

    if (clients.length > 0) {
      for (const client of clients) {
        const saleconnector = await SaleConnector.find({
          client: client._id,
        }).sort({ createdAt: -1 });
        if (saleconnector.length > 0) {
          client.saleconnectorid = saleconnector[0]._id;
        }
      }
    }

    res.status(201).send(clients);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.updateClient = async (req, res) => {
  try {
    const { _id, market, name,phoneNumber, packman, search, currentPage, countPage } =
      req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const client = await Client.findById(_id);
    if (!client) {
      return res
        .status(400)
        .json({ message: `Diqqat! ${name} mijoz avval yaratilmagan` });
    }
    const updatedClient = {
      name,
      phoneNumber,
    };
    const packMan = await Packman.findById(packman);
    if (packMan) {
      await Packman.findByIdAndUpdate(client.packman, {
        $pull: {
          clients: _id,
        },
      });
      if (client.packman !== packMan._id) {
        await Packman.findByIdAndUpdate(packMan._id, {
          $push: {
            clients: _id,
          },
        });
      } else {
        await Packman.findByIdAndUpdate(client.packman, {
          $push: {
            clients: _id,
          },
        });
      }
      updatedClient.packman = { name: packMan.name, _id: packMan._id };
    }

    await Client.findByIdAndUpdate(_id, {
      ...updatedClient,
    });

    const clientname = new RegExp(
      ".*" + search ? search.client : "" + ".*",
      "i"
    );
    const clientpackman = new RegExp(
      ".*" + search ? search.packman : "" + ".*",
      "i"
    );

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } })
      .populate("packman", "name")
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.deleteClient = async (req, res) => {
  try {
    const { _id, market, name, packman, search, currentPage, countPage } =
      req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const client = await Client.findById(_id);
    if (!client) {
      return res
        .status(400)
        .json({ message: `Diqqat! ${name} mijoz avval yaratilmagan!` });
    }

    if (packman) {
      const packMan = await Packman.findById(packman);

      if (packMan) {
        await Packman.findByIdAndUpdate(packman, {
          $pull: {
            clients: client._id,
          },
        });
      }
    }
    await Client.findByIdAndDelete(_id);

    const clientname = new RegExp(
      ".*" + search ? search.client : "" + ".*",
      "i"
    );
    const clientpackman = new RegExp(
      ".*" + search ? search.packman : "" + ".*",
      "i"
    );

    const clientsCount = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } });

    const filterCount = clientsCount.filter((item) => {
      return item.packman !== null;
    });

    const clients = await Client.find({ market, name: clientname })
      .sort({ _id: -1 })
      .select("name market packman phoneNumber")
      .populate({ path: "packman", match: { name: clientpackman } })
      .populate("packman", "name")
      .skip(currentPage * countPage)
      .limit(countPage);

    const filter = clients.filter((item) => {
      return item.packman !== null;
    });

    res.status(201).json({ clients: filter, count: filterCount.length });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.paymentDebt = async (req, res) => {
  try {
    const { payment, user, saleconnectorid, products, debt_id, market } = req.body;

    const debt = await Debt.findById(debt_id);
    if (!debt) {
      return res.status(404).json({ message: 'Debt not found' });
    }
    debt.debt -= payment.card + payment.cash + payment.transfer;
    debt.debtuzs -= payment.carduzs + payment.cashuzs + payment.transferuzs;
    await debt.save();
    const saleConnector = await SaleConnector.findById(saleconnectorid);
    if (!saleConnector) {
      return res.status(404).json({ message: 'SaleConnector not found' });
    }
    const newPayment=await Payment({
      comment: payment.comment,
      payment: payment.card + payment.cash + payment.transfer,
      paymentuzs: payment.carduzs + payment.cashuzs + payment.transferuzs,
      card: payment.card,
      cash: payment.cash,
      transfer: payment.transfer,
      carduzs: payment.carduzs,
      cashuzs: payment.cashuzs,
      transferuzs: payment.transferuzs,
      type: payment.type,
      products,
      market,
      user,
      saleconnector: saleconnectorid,
    })
   await newPayment.save();
    saleConnector.payments.push(newPayment._id); 
    await saleConnector.save();
    
    const returnpayment = await Payment.findById(newPayment._id).populate({
      path: "saleconnector",
      select: "client packman",
      populate: { path: "client", select: "name" },
    });
    res.status(200).json(returnpayment );
  } catch (error) {
    // Handle any errors that occur
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'An error occurred while processing the payment', error });
  }
};
module.exports.getClients = async (req, res) => {
  try {
    const { market, search } =
      req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const name = regExpression(search ? search.client : "");
    const packman = search.packman;

    let clientsCount = [];
    let clients = [];
    if (packman) {
      clientsCount = await Client.find({
        market,
        name,
        packman,
      }).count();

      clients = await Client.find({
        market,
        name: name,
        packman,
      })
        .sort({ _id: -1 })
        .select("name market packman phoneNumber")
        .populate("packman", "name")
    } else {
      clientsCount = await Client.find({
        market,
        name: name,
      }).count();

      clients = await Client.find({
        market,
        name: name,
      })
        .sort({ _id: -1 })
        .select("name market phoneNumber packman")
        .populate("packman", "name")
    }

    const reduceForSales = (arr, key) => {
      return arr.reduce((prev, connector) => {
        prev.push(...connector[key]);
        return prev;
      }, []);
    };

    let newClients = [];

    for (let client of clients) {
      const saleconnectors = await SaleConnector.find({
        market,
        client: client._id,
        // createdAt: {
        //   $gte: startDate,
        //   $lt: endDate,
        // },
      })
        .select("-isArchive -market -__v")
        .sort({ createdAt: -1 })
        .populate({
          path: "products",
          select: "user",
          populate: {
            path: "user",
            select: "firstname lastname",
          },
        })
        .populate({
          path: "products",
          select: "price",
          populate: {
            path: "price",
            select: "incomingprice incomingpriceuzs",
          },
        })
        .populate({
          path: "products",
          select:
            "totalprice unitprice totalpriceuzs unitpriceuzs pieces createdAt discount saleproducts product",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "product",
            select: "productdata",
            populate: { path: "productdata", select: "name code" },
          },
        })
        .populate(
          "payments",
          "payment paymentuzs comment totalprice totalpriceuzs createdAt"
        )
        .populate(
          "discounts",
          "discount discountuzs procient products totalprice totalpriceuzs"
        )
        .populate({ path: "client", select: "name" })
        .populate("packman", "name")
        .populate("user", "firstname lastname")
        .populate("dailyconnectors", "comment");

      let s = null;
      if (saleconnectors.length > 0) {
        const payments = reduceForSales(saleconnectors, "payments");
        const products = reduceForSales(saleconnectors, "products");
        const debts = reduceForSales(saleconnectors, "debts");
        const discounts = reduceForSales(saleconnectors, "discounts");
        const dailyconnectors = reduceForSales(
          saleconnectors,
          "dailyconnectors"
        );

        const totalsales = [...products].reduce(
          (prev, el) => prev + el.totalprice || 0,
          0
        );
        const totalsalesuzs = [...products].reduce(
          (prev, el) => prev + el.totalpriceuzs || 0,
          0
        );
        const incomings = [...products].reduce(
          (prev, el) =>
            prev + el.pieces * ((el.price && el.price.incomingprice) || 0),
          0
        );
        const incomingsuzs = [...products].reduce(
          (prev, el) =>
            prev + el.pieces * ((el.price && el.price.incomingpriceuzs) || 0),
          0
        );

        s = {
          products: products,
          payments: payments,
          debts: debts,
          discounts: discounts,
          dailyconnectors: dailyconnectors,
          user: saleconnectors[0].user,
          createdAt: saleconnectors[0].createdAt,
          totalsales: totalsales,
          totalsalesuzs: totalsalesuzs,
          profit: totalsales - incomings,
          profituzs: totalsalesuzs - incomingsuzs,
          id: saleconnectors[0].id,
        };
      }
      const newClient = {
        _id: client._id,
        name: client.name,
        market: client.market,
        packman: client.packman,
        saleconnector: s,
      };
      newClients.push(newClient);
    }

    res.status(201).json({ clients: newClients, count: clientsCount });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getClientsSales = async (req, res) => {
  try {
    const { market, clientId } =
      req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: `Diqqat! Do'kon haqida malumotlar topilmadi!` });
    }

    //========================================

    const allpayments = await DailySaleConnector.find({
      market,
    })
      .select("-isArchive -updatedAt -market -__v")
      .populate({
        path: "products",
        select:
          "totalprice unitprice totalpriceuzs unitpriceuzs pieces fromFilial",
        populate: {
          path: "product",
          select: "productdata total",
          populate: {
            path: "productdata",
            select: "code name",
            options: { sort: { code: 1 } },
          },
        },
      })
      .populate("payment", "payment paymentuzs totalprice totalpriceuzs")
      .populate("discount", "discount discountuzs")
      .populate("debt", "debt debtuzs")
      .populate({
        path: "client",
        select: "name",
        match: { _id: clientId },
      })
      .populate("packman", "name")
      .populate("user", "firstname lastname")
      .populate({
        path:"saleconnector",
       populate:{
        path:"payments",
        match: { totalprice: { $exists: false } }
       },
      })
      .lean()
      .then(connectors => connectors.filter(connector => connector.client))

    const response = allpayments.filter(
      (product) => product.client !== null
    );
    const count = response.length;
console.log(allpayments);
    res.status(201).json({ data: response, count });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
