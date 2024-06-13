const { Market } = require('../../models/MarketAndBranch/Market');
const { DailySaleConnector } = require('../../models/Sales/DailySaleConnector');
const { SaleConnector } = require('../../models/Sales/SaleConnector');
require('../../models/Sales/SaleProduct');
require('../../models/Sales/Discount');
require('../../models/Sales/Payment');
require('../../models/Sales/Packman');
require('../../models/Sales/Client');
require('../../models/Users');
require('../../models/Sales/DailySaleConnector');
require('../../models/Products/Product');
require('../../models/Products/Productdata');

module.exports.getSellersReport = async (req, res) => {
  try {
    const {
      market,
      countPage,
      currentPage,
      startDate,
      endDate,
      search,
      seller,
    } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi!`,
      });
    }

    const id = new RegExp('.*' + search ? search.id : '' + '.*', 'i');

    const name = new RegExp('.*' + search ? search.client : '' + '.*', 'i');

    const saleconnectors = await DailySaleConnector.find({
      market,
      user: seller,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select("-isArchive -market -__v")
      .populate({
        path: "products",
        select:
          "totalprice unitprice totalpriceuzs unitpriceuzs pieces fromFilial createdAt",
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
      })
      .populate("packman", "name")
      .populate("user", "firstname lastname")
      .populate({
        path: "saleconnector",
        select: "id",
        match: {id: id}
      })

    const filter = saleconnectors.filter((item) => {
      return item.saleconnector !== null
    });
    const count = filter.length;
    res.status(200).json({
      saleconnectors: filter.splice(countPage * currentPage, countPage),
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
