const {
  TemporaryIncoming,
  validateTemporaryIncoming,
} = require('../../models/Products/TemporaryIncoming');
const { Market } = require('../../models/MarketAndBranch/Market');

module.exports.register = async (req, res) => {
  try {
    const { temporaryincoming, market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: `Diqqat! Do'kon haqida malumotlar topilmadi.`,
      });
    }

    const newTemporaryIncoming = new TemporaryIncoming({
      temporaryincoming,
      market,
    });
    await newTemporaryIncoming.save();

    const temporaries = await TemporaryIncoming.find({ market })
      .select('temporaryincoming createdAt')
      .sort({ _id: -1 });

    res.status(201).send(temporaries);
  } catch (error) {
    res.status(400).json({ error: 'Serverda xatolik yuz berdi...' });
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

    const temporaries = await TemporaryIncoming.find({ market })
      .select('temporaryincoming createdAt')
      .sort({ _id: -1 });

    res.status(201).send(temporaries);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.deleteTemporaryIncoming = async (req, res) => {
  try {
    const { _id, market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }

    await TemporaryIncoming.findByIdAndDelete(_id);

    const temporaries = await TemporaryIncoming.find({ market })
      .select('temporaryincoming createdAt')
      .sort({ _id: -1 });

    res.status(201).send(temporaries);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
