const { Market } = require('../../models/MarketAndBranch/Market');
const { Debt } = require('../../models/Sales/Debt');
const { SaleConnector } = require('../../models/Sales/SaleConnector');
const { Client } = require('../../models/Sales/Client');
const { SaleProduct } = require('../../models/Sales/SaleProduct');
const { Discount } = require('../../models/Sales/Discount');
const { Payment } = require('../../models/Sales/Payment');

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

    const debts = await SaleConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select('-isArchive -updatedAt -user -market -__v')
      .sort({ _id: -1 })
      .populate('payments', 'payment paymentuzs')
      .populate('discounts', 'discount discountuzs')
      .populate('client', 'name')
      .populate('packman', 'name')
      .populate('debts', 'debt debtuzs')
      .populate({
        path: 'products',
        select:
          'totalprice unitprice totalpriceuzs unitpriceuzs pieces createdAt discount',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'product',
          select: 'name code',
        },
      });

    const alldebts = [];

    let total = 0;
    let totaluzs = 0;

    debts.map((debt) => {
      const totalprice = debt.products.reduce((summ, product) => {
        return summ + product.totalprice;
      }, 0);

      const totalpriceuzs = debt.products.reduce((summ, product) => {
        return summ + product.totalpriceuzs;
      }, 0);

      const discounts = debt.discounts.reduce((summ, product) => {
        return summ + product.discount;
      }, 0);

      const discountsuzs = debt.discounts.reduce((summ, product) => {
        return summ + product.discountuzs;
      }, 0);

      const payments = debt.payments.reduce((summ, product) => {
        return summ + product.payment;
      }, 0);

      const paymentsuzs = debt.payments.reduce((summ, product) => {
        return summ + product.paymentuzs;
      }, 0);

      const d =
        Math.round(totalprice * 1000) / 1000 -
        Math.round(payments * 1000) / 1000 -
        Math.round(discounts * 1000) / 1000;

      const duzs =
        Math.round(totalpriceuzs * 1) / 1 -
        Math.round(paymentsuzs * 1) / 1 -
        Math.round(discountsuzs * 1) / 1;

      if (d > 0.01 || d < -0.01) {
        debt.debt = Math.round(d * 10000) / 10000;
        alldebts.push({
          _id: debt._id,
          id: debt.id,
          client: debt.client,
          createdAt: debt.createdAt,
          debt: Math.round(d * 1000) / 1000,
          debtuzs: Math.round(duzs * 1) / 1,
          saleconnector: debt,
        });
      }

      total += Math.round(d * 1000) / 1000;
      totaluzs += Math.round(duzs * 1) / 1;
    });

    const count = alldebts.length;
    res.status(200).send({
      debts: alldebts.splice(countPage * currentPage, countPage),
      count,
      total,
      totaluzs,
    });
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

    const debts = await SaleConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select(
        '-isArchive -updatedAt -user -market -__v -debts -dailyconnectors'
      )
      .sort({ _id: -1 })
      .populate('products', 'totalprice')
      .populate('payments', 'payment paymentuzs')
      .populate('discounts', 'discount discountuzs')
      .populate('client', 'name');

    const alldebts = [];

    debts.map((debt) => {
      const totalprice = debt.products.reduce((summ, product) => {
        return summ + product.totalprice;
      }, 0);

      const discounts = debt.discounts.reduce((summ, product) => {
        return summ + product.discount;
      }, 0);

      const payments = debt.payments.reduce((summ, product) => {
        return summ + product.payment;
      }, 0);

      const d =
        Math.round(totalprice * 10000) / 10000 -
        Math.round(payments * 10000) / 10000 -
        Math.round(discounts * 10000) / 10000;

      if (d > 0.1 || d < -0.1) {
        debt.debt = Math.round(d * 10000) / 10000;
        alldebts.push({
          _id: debt._id,
          id: debt.id,
          client: debt.client,
          createdAt: debt.createdAt,
          debt: Math.round(d * 10000) / 10000,
        });
      }
    });

    res.status(200).send(alldebts);
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
