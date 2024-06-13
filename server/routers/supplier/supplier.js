const {
  Supplier,
  validateSupplier,
} = require('../../models/Supplier/Supplier');
const { Market } = require('../../models/MarketAndBranch/Market');
const {
  IncomingConnector,
} = require('../../models/Products/IncomingConnector');
require('../../models/Products/IncomingPayment');
require('../../models/Products/Incoming');

//Supplier register

module.exports.register = async (req, res) => {
  try {
    const { name, market, currentPage, countPage, search } = req.body;
    const { error } = validateSupplier({ market, name });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const supplier = await Supplier.findOne({
      market,
      name,
    });

    if (supplier) {
      return res.status(400).json({
        message: 'Diqqat! Ushbu yetkazib beruvchi avval yaratilgan.',
      });
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newSupplier = new Supplier({
      name,
      market,
    });
    await newSupplier.save();

    const suppliername = new RegExp('.*' + search.name + '.*', 'i');

    const count = await Supplier.find({ market, name: suppliername }).count();

    const suppliers = await Supplier.find({ market, name: suppliername })
      .sort({ _id: -1 })
      .select('name market')
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ suppliers: suppliers, count: count });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Supplier update
module.exports.update = async (req, res) => {
  try {
    const { name, market, currentPage, countPage, search } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const old = await Supplier.findOne({
      market,
      name,
    });

    if (old) {
      return res.status(400).json({
        message: 'Diqqat! Ushbu yetkazib beruvchi avval yaratilgan.',
      });
    }

    const supplier = await Supplier.findById(req.body._id);

    if (!supplier) {
      return res.status(400).json({
        message: 'Diqqat! Ushbu yetkazib beruvchi topilmadi.',
      });
    }

    supplier.name = name;
    await supplier.save();

    const suppliername = new RegExp('.*' + search.name + '.*', 'i');

    const count = await Supplier.find({ market, name: suppliername }).count();

    const suppliers = await Supplier.find({ market, name: suppliername })
      .sort({ _id: -1 })
      .select('name market')
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ suppliers: suppliers, count: count });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Supplier update
module.exports.delete = async (req, res) => {
  try {
    const { _id, market, currentPage, countPage, search } = req.body;

    await Supplier.findByIdAndDelete(_id);
    const suppliername = new RegExp('.*' + search.name + '.*', 'i');

    const count = await Supplier.find({ market, name: suppliername }).count();

    const suppliers = await Supplier.find({ market, name: suppliername })
      .sort({ _id: -1 })
      .select('name market')
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ suppliers: suppliers, count: count });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Supplier getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const suppliers = await Supplier.find({
      market,
    }).select('name market');

    res.send(suppliers);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getSuppliers = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const name = new RegExp('.*' + search.name + '.*', 'i');

    const count = await Supplier.find({ market, name }).count();

    const suppliers = await Supplier.find({ market, name })
      .sort({ _id: -1 })
      .select('name market')
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ suppliers: suppliers, count: count });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getSuppliersExcel = async (req, res) => {
  try {
    const { market, search } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const name = new RegExp('.*' + search.name + '.*', 'i');

    const suppliers = await Supplier.find({ market, name })
      .sort({ _id: -1 })
      .select('name market');

    res.status(201).json(suppliers);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getincoming = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const suppliers = await Supplier.find({ market })
      .sort({ _id: -1 })
      .select('name');

    res.status(201).json(suppliers);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.getSupplierReport = async (req, res) => {
  try {
    const { supplierid, market, startDate, endDate, currentPage, countPage } =
      req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const reducer = (arr, key) =>
      arr.reduce((prev, item) => prev + (item[key] || 0), 0);

    const connectors = await IncomingConnector.find({
      market,
      supplier: supplierid,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select('-isArchive -updatedAt -__v')
      .populate('supplier', 'name')
      .populate('payments', 'totalprice totalpriceuzs payment paymentuzs')
      .populate('incoming', 'pieces');

    const response = connectors.map((connector) => {
      const totalpayment = reducer(connector.payments, 'payment');
      const totalpaymentuzs = reducer(connector.payments, 'paymentuzs');
      const debt = connector.total - totalpayment;
      const debtuzs = connector.totaluzs - totalpaymentuzs;

      return {
        _id: connector._id,
        id: connector.id,
        supplier: connector.supplier,
        createdAt: connector.createdAt,
        incoming: connector.incoming,
        total: connector.total,
        totaluzs: connector.totaluzs,
        totalpayment: totalpayment,
        totalpaymentuzs: totalpaymentuzs,
        debt,
        debtuzs,
      };
    });

    res.status(201).json({
      count: response.length,
      data: response.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
