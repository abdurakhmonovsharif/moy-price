const { Unit, validateUnit } = require("../../models/Products/Unit");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Product } = require("../../models/Products/Product");
const { ProductType } = require("../../models/Products/ProductType");

//Unit register
// module.exports.registerAll = async (req, res) => {
//   try {
//     const units = req.body
//     const all = []
//     for (const d of units) {
//       const { error } = validateUnit(d)
//       if (error) {
//         return res.status(400).json({
//           error: error.message,
//         })
//       }

//       const { name, probirka, market } = d

//       const marke = await Market.findOne({ name: market })

//       if (!marke) {
//         return res.status(400).json({
//           message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
//         })
//       }

//       const unit = await Unit.findOne({
//         market: marke._id,
//         name,
//       })

//       if (unit) {
//         return res.status(400).json({
//           message: `Diqqat! ${name} o'lchov birligii avval yaratilgan.`,
//         })
//       }

//       const newUnit = new Unit({
//         name,
//         probirka,
//         market: marke._id,
//       })
//       await newUnit.save()
//       all.push(newUnit)
//     }

//     res.send(all)
//   } catch (error) {
//     res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
//   }
// }

//Unit register

module.exports.register = async (req, res) => {
  try {
    const { error } = validateUnit(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const { name, market } = req.body;

    const unit = await Unit.findOne({
      market,
      name,
    });

    if (unit) {
      return res.status(400).json({
        message: "Diqqat! Ushbu o'lchov birligi avval yaratilgan.",
      });
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newUnit = new Unit({
      name,
      market,
    });
    await newUnit.save();
    res.send(newUnit);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Unit update
module.exports.update = async (req, res) => {
  try {
    const { name, market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const old = await Unit.findOne({
      market,
      name,
    });

    if (old) {
      return res.status(400).json({
        message: "Diqqat! Ushbu o'lchov birligi avval yaratilgan.",
      });
    }

    const unit = await Unit.findById(req.body._id);

    if (!unit) {
      return res.status(400).json({
        message: "Diqqat! Ushbu o'lchov birligi topilmadi.",
      });
    }

    unit.name = name;
    await unit.save();

    const units = await Unit.find({ market }).select("name").sort({ _id: -1 });

    res.status(201).send(units);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Unit update
module.exports.delete = async (req, res) => {
  try {
    const { _id } = req.body;
    await Unit.findByIdAndDelete(_id);
    const units = await Unit.find({ market: req.body.market })
      .select("name")
      .sort({ _id: -1 });
    res.status(200).send(units);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Unit getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const units = await Unit.find({
      market,
    })
      .select("name market")
      .sort({ _id: -1 });

    res.send(units);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
