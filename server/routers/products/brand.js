const { Brand, validateBrand } = require('../../models/Products/Brand');
const { Market } = require('../../models/MarketAndBranch/Market');
const { Category } = require('../../models/Products/Category');
const { Product } = require('../../models/Products/Product');
const ObjectId = require('mongodb').ObjectId;
//Brand register

module.exports.register = async (req, res) => {
  try {
    const { error } = validateBrand(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { name, market } = req.body;

    const brand = await Brand.findOne({
      market,
      name,
    });

    if (brand) {
      return res.status(400).json({
        message: `Diqqat! ${name} brandi avval yaratilgan.`,
      });
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newBrand = new Brand({
      name,
      market,
    });
    await newBrand.save();

    res.send(newBrand);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Brand update
module.exports.update = async (req, res) => {
  try {
    const { _id, name, market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const brand = await Brand.findById(_id);

    if (!brand) {
      return res.status(400).json({
        message: `Diqqat! ${name} brandi avval yaratilmagan.`,
      });
    }

    const old = await Brand.findOne({
      market,
      name,
    });

    if (old) {
      return res.status(400).json({
        message: `Diqqat! ${name} brandi avval yaratilgan.`,
      });
    }

    brand.name = name;
    await brand.save();

    res.send(brand);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Brand delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, market, name } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const brand = await Brand.findById(_id);

    if (!brand) {
      return res.status(400).json({
        message: `Diqqat! ${name} brandi avval yaratilmagan.`,
      });
    }

    await Brand.findByIdAndDelete(_id);

    res.send(brand);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Brand getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const brand = await Brand.find({
      market,
    })
      .select('name market')
      .sort({ _id: -1 });
    res.status(201).json(brand);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getBrands = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const name = new RegExp('.*' + (search ? search.name : '') + '.*', 'i');

    const brandCount = await Brand.find({ market, name }).count();

    const brands = await Brand.find({
      market,
      name,
    })
      .sort({ _id: -1 })
      .select('name market')
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ brands: brands, count: brandCount });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getBrandsExcel = async (req, res) => {
  try {
    const { market, search } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const name = new RegExp('.*' + (search ? search.name : '') + '.*', 'i');

    const brands = await Brand.find({
      market,
      name,
    })
      .sort({ _id: -1 })
      .select('name market');
    res.status(201).json(brands);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
