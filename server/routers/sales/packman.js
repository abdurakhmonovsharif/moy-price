const { Packman, validatePackman } = require("../../models/Sales/Packman.js");
const { Market } = require("../../models/MarketAndBranch/Market");

module.exports.register = async (req, res) => {
  try {
    const { name, market, currentPage, countPage, search } = req.body;
    const { error } = validatePackman({ name, market });
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

    const packman = await Packman.findOne({
      name,
      market,
    });
    if (packman) {
      return res.status(400).json({
        message: `Diqqat! ${name} yetkazuvchi avval yaratilgan!`,
      });
    }

    const newPackman = new Packman({
      name,
      market,
    });

    await newPackman.save();
    const namepackman = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const packmansCount = await Packman.find({
      market,
      name: namepackman,
    }).count();

    const packmans = await Packman.find({ market, name: namepackman })
      .sort({ _id: -1 })
      .select("name market")
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ packmans: packmans, count: packmansCount });
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

    const packman = await Packman.find({ market })
      .select("name market clients")
      .populate("clients");

    res.status(201).send(packman);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.updatePackman = async (req, res) => {
  try {
    const { _id, market, name, search, countPage, currentPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const packman = await Packman.findById(_id);
    if (!packman) {
      return res
        .status(400)
        .json({ message: `Diqqat! ${name} yetkazuvchi avval yaratilmagan` });
    }

    await Packman.findByIdAndUpdate(_id, {
      name: name,
    });

    await Packman.findById(_id).select("name market");

    const namepackman = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const packmansCount = await Packman.find({
      market,
      name: namepackman,
    }).count();

    const packmans = await Packman.find({ market, name: namepackman })
      .sort({ _id: -1 })
      .select("name market")
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ packmans: packmans, count: packmansCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.deletePackman = async (req, res) => {
  try {
    const { _id, market, name, search, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon haqida malumot topilmadi!" });
    }
    const packman = await Packman.findById(_id);
    if (!packman) {
      return res
        .status(400)
        .json({ message: `Diqqat! ${name} yetkazuvchi avval yaratilmagan!` });
    }

    if (packman.clients && packman.clients.length > 0) {
      return res.status(400).json({
        message: `Diqqat!  Agentda mijozlar mavjudligi sababli agentni ro'yxatdan o'chirishning imkoni mavjud emas!`,
      });
    }

    await Packman.findByIdAndDelete(_id);

    const namepackman = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const packmansCount = await Packman.find({
      market,
      name: namepackman,
    }).count();

    const packmans = await Packman.find({ market, name: namepackman })
      .sort({ _id: -1 })
      .select("name market")
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ packmans: packmans, count: packmansCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getPackmans = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");

    const packmansCount = await Packman.find({ market, name: name }).count();

    const packmans = await Packman.find({ market, name: name })
      .sort({ _id: -1 })
      .select("name market")
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ packmans: packmans, count: packmansCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
