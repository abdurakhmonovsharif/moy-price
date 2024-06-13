const { validateBarcode, Barcode } = require("../../models/Barcode/Barcode.js");

module.exports.register = async (req, res) => {
  try {
    const { barcode, search, currentPage, countPage } = req.body;

    const { error } = validateBarcode({ ...barcode });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const oldBarcode = await Barcode.findOne({ barcode: barcode.barcode });
    if (oldBarcode)
      return res.status(400).json({
        error: "Diqqat! Shtrix kod avval yaratilgan",
      });
    const newBarcode = new Barcode({ ...barcode });
    await newBarcode.save();

    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");

    const barcodesCount = await Barcode.find({ barcode: code }).count();
    const barcodes = await Barcode.find({ barcode: code })
      .sort({ _id: -1 })
      .select("barcode name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).send({ barcodes, count: barcodesCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.registerAll = async (req, res) => {
  try {
    const { barcodes, search, currentPage, countPage } = req.body;
    for (const i in barcodes) {
      const { error } = validateBarcode({ ...barcodes[i] });
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      const oldBarcode = await Barcode.findOne({
        barcode: barcodes[i].barcode,
      });
      if (oldBarcode)
        return res.status(400).json({
          error: `Diqqat! ${i + 1} qatordagi ${
            barcodes[i].barcode
          } shtrix kod avval yaratilgan`,
        });
    }
    for (const i in barcodes) {
      const newBarcode = new Barcode({ ...barcodes[i] });
      await newBarcode.save();
    }

    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");

    const barcodesCount = await Barcode.find({ barcode: code }).count();
    const barcodess = await Barcode.find({ barcode: code })
      .sort({ _id: -1 })
      .select("barcode name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).send({ barcodes: barcodess, count: barcodesCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getbycode = async (req, res) => {
  try {
    const { code } = req.body;
    const barcode = await Barcode.findOne({ barcode: code }).select(
      "name barcode"
    );
    if (!barcode)
      return res.status(400).json({
        error: `Diqqat! ${code} shtrix kodli mahsulot mahsulotlar bazasida mavjud emas!`,
      });

    res.status(201).send(barcode);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    const { search, currentPage, countPage } = req.body;
    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");

    const barcodesCount = await Barcode.find({ barcode: code }).count();
    const barcodes = await Barcode.find({ barcode: code })
      .sort({ _id: -1 })
      .select("barcode name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).send({ barcodes, count: barcodesCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.update = async (req, res) => {
  try {
    const { barcode, search, currentPage, countPage } = req.body;

    const { error } = validateBarcode({ ...barcode });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    await Barcode.findByIdAndUpdate(barcode._id, { ...barcode });
    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");

    const barcodesCount = await Barcode.find({ barcode: code }).count();
    const barcodes = await Barcode.find({ barcode: code })
      .sort({ _id: -1 })
      .select("barcode name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).send({ barcodes, count: barcodesCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
