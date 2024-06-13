const {
  TemporaryTransfer,
} = require('../../models/FilialProducts/TemporaryTransfer');
const { Market } = require('../../models/MarketAndBranch/Market');

module.exports.createTemporary = async (req, res) => {
  try {
    const { market, filial, products } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    if (!marke.filials.includes(filial)) {
      return res.status(400).json({
        message: "Diqqat! Bosh do'konda bunaqa filial mavjud emas.",
      });
    }

    const temporary = new TemporaryTransfer({
      market,
      filial,
      temporary: [...products],
    });
    await temporary.save();

    const responseTemporary = await TemporaryTransfer.findById(temporary._id);

    res.status(200).json(responseTemporary);
  } catch (error) {
    res.status(500).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getTemporary = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const temporaries = await TemporaryTransfer.find({ market }).select(
      'temporary createdAt market filial'
    );

    res.status(200).json(temporaries);
  } catch (error) {
    res.status(500).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.deleteTemporary = async (req, res) => {
  try {
    const { _id, market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    await TemporaryTransfer.findByIdAndDelete(_id);

    const response = await TemporaryTransfer.find({ market }).select(
      'temporary createdAt market filial'
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
