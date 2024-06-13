const { Market } = require('../../models/MarketAndBranch/Market');
const { Discount } = require('../../models/Sales/Discount');
const { SaleConnector } = require('../../models/Sales/SaleConnector');
const { Client } = require('../../models/Sales/Client');

module.exports.get = async (req, res) => {
  try {
    const { market, search, startDate, endDate, currentPage, countPage } =
      req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi!`,
      });
    }
    const discounts = await SaleConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select('id discounts client createdAt')
      .sort({ _id: -1 })
      .populate('discounts', 'discount discountuzs')
      .populate('products', 'totalprice totalpriceuzs')
      .populate('client', 'name');

    const alldiscounts = [];

    let totaldiscounts = 0;
    let totaldiscountsuzs = 0;
    let total = 0;
    let totaluzs = 0;

    discounts.map((connector) => {
      const totalprice = connector.products.reduce((summ, product) => {
        return summ + product.totalprice;
      }, 0);

      const totalpriceuzs = connector.products.reduce((summ, product) => {
        return summ + product.totalpriceuzs;
      }, 0);

      const discount = connector.discounts.reduce((summ, discount) => {
        return summ + discount.discount;
      }, 0);

      const discountuzs = connector.discounts.reduce((summ, discount) => {
        return summ + discount.discountuzs;
      }, 0);

      if (discount > 0.01) {
        alldiscounts.push({
          _id: connector._id,
          id: connector.id,
          client: connector.client,
          createdAt: connector.createdAt,
          discount: Math.round(discount * 1000) / 1000,
          discountuzs: Math.round(discountuzs * 1) / 1,
          total: Math.round(totalprice * 1000) / 1000,
          totaluzs: Math.round(totalpriceuzs * 1000) / 1000,
        });
        totaldiscounts += Math.round(discount * 1000) / 1000;
        totaldiscountsuzs += Math.round(discountuzs * 1) / 1;
        total += Math.round(totalprice * 1000) / 1000;
        totaluzs += Math.round(totalpriceuzs * 1) / 1;
      }
    });

    const count = alldiscounts.length;

    const data = {
      discounts: alldiscounts.splice(countPage * currentPage, countPage),
      count,
      total,
      totaluzs,
      totaldiscounts,
      totaldiscountsuzs,
    };
    res.status(200).send(data);
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getexcel = async (req, res) => {
  try {
    const { market, search, startDate, endDate } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi!`,
      });
    }

    const client = new RegExp(
      '.*' + search ? search.clientname : '' + '.*',
      'i'
    );

    const discounts = await Discount.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select('-isArchive -updatedAt -user -market -__v -products')
      .sort({ _id: -1 })
      .populate({
        path: 'saleconnector',
        select: 'client',
        populate: {
          path: 'client',
          select: 'name',
          match: { name: client },
        },
      });
    res.status(200).send(discounts);
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
