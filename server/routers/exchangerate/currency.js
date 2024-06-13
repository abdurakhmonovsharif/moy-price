const {
  Currency,
  validateCurrency,
} = require('../../models/Exchangerate/Currency');
const { Market } = require('../../models/MarketAndBranch/Market');

//Currency register

module.exports.currencyget = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    let currentcurrency = await Currency.findOne({ market });
    if (!currentcurrency) {
      currentcurrency = new Currency({
        currency: 'USD',
        market,
      });
      await currentcurrency.save();
    }
    res.status(200).send({ currency: currentcurrency.currency });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.currencyupdate = async (req, res) => {
  try {
    const { error } = validateCurrency(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const { currency, market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    let currentcurrency = await Currency.findOne({ market });
    if (!currentcurrency) {
      currentcurrency = new Currency({
        currency,
        market,
      });
      await currentcurrency.save();
    } else {
      await Currency.findByIdAndUpdate(currentcurrency._id, { currency });
    }
    res.status(200).send({ currency });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
