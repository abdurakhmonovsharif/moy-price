const { Market } = require('../../models/MarketAndBranch/Market');
const { Payment } = require('../../models/Sales/Payment');
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

    const client = new RegExp(
      '.*' + search ? search.clientname : '' + '.*',
      'i'
    );

    const count = await Payment.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).count();

    const payments = await Payment.find({
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
    // .skip(currentPage * countPage)
    // .limit(countPage);
    const cash = payments.reduce((summ, payment) => {
      return summ + payment.cash;
    }, 0);
    const card = payments.reduce((summ, payment) => {
      return summ + payment.card;
    }, 0);
    const transfer = payments.reduce((summ, payment) => {
      return summ + payment.transfer;
    }, 0);

    const cashuzs = payments.reduce((summ, payment) => {
      return summ + payment.cashuzs;
    }, 0);
    const carduzs = payments.reduce((summ, payment) => {
      return summ + payment.carduzs;
    }, 0);
    const transferuzs = payments.reduce((summ, payment) => {
      return summ + payment.transferuzs;
    }, 0);

    res.status(200).send({
      payments: payments.splice(currentPage * countPage, countPage),
      count,
      total: { cash, card, transfer, cashuzs, carduzs, transferuzs },
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

    const client = new RegExp(
      '.*' + search ? search.clientname : '' + '.*',
      'i'
    );

    const payments = await Payment.find({
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
    res.status(200).send(payments);
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
