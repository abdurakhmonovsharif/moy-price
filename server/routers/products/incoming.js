const {
  Incoming,
  validateIncoming,
  validateIncomingAll,
} = require('../../models/Products/Incoming');
const { Market } = require('../../models/MarketAndBranch/Market');
const { ProductType } = require('../../models/Products/ProductType');
const { Category } = require('../../models/Products/Category');
const { Unit } = require('../../models/Products/Unit');
const { Product } = require('../../models/Products//Product');
const { Brand } = require('../../models/Products/Brand');
const {
  IncomingConnector,
} = require('../../models/Products/IncomingConnector');
const { ProductPrice } = require('../../models/Products/ProductPrice');
const { Supplier } = require('../../models/Supplier/Supplier');
const router = require('./category_products');
const { ProductData } = require('../../models/Products/Productdata');
const { IncomingPayment } = require('../../models/Products/IncomingPayment');
const {
  IncomingDailyConnector,
} = require('../../models/Products/IncomingDailyConnector');
const { Debt } = require('../../models/Sales/Debt');
const ObjectId = require('mongodb').ObjectId;

const convertToUsd = (num) => Math.round(num * 1000) / 1000;
const convertToUzs = (num) => Math.round(num * 1) / 1;

//Incoming registerall
module.exports.registerAll = async (req, res) => {
  try {
    const { market, startDate, endDate, products, payment, user } = req.body;

    const all = [];
    for (const newproduct of products) {
      delete newproduct.oldprice;
      delete newproduct.oldpriceuzs;
      const { error } = validateIncomingAll(newproduct);
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      const {
        product,
        unit,
        supplier,
        pieces,
        unitprice,
        totalprice,
        unitpriceuzs,
        totalpriceuzs,
        sellingprice,
        sellingpriceuzs,
        tradeprice,
        tradepriceuzs,
      } = newproduct;

      const marke = await Market.findById(market);

      if (!marke) {
        return res.status(400).json({
          message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
        });
      }

      const produc = await Product.findById(product._id);

      if (!produc) {
        return res.status(400).json({
          message: `Diqqat! ${product.code} kodli mahsulot avval yaratilmagan.`,
        });
      }

      const unitt = await Unit.findById(unit._id);

      if (!unitt) {
        return res.status(400).json({
          message: `Diqqat! ${unit.name} o'lchov birligi tizimda mavjud emas.`,
        });
      }

      const newProduct = new Incoming({
        product: product._id,
        supplier: supplier._id,
        unit: unit._id,
        pieces,
        unitprice: Math.round(unitprice * 10000) / 10000,
        totalprice: Math.round(totalprice * 10000) / 10000,
        unitpriceuzs: Math.round(unitpriceuzs * 10000) / 10000,
        totalpriceuzs: Math.round(totalpriceuzs * 10000) / 10000,
        unit: unit._id,
        market,
        user,
      });

      all.push(newProduct);

      const newProductPrice = new ProductPrice({
        product: product._id,
        incomingprice: Math.round(unitprice * 10000) / 10000,
        incomingpriceuzs: Math.round(unitpriceuzs * 10000) / 10000,
        sellingprice: Math.round(sellingprice * 10000) / 10000,
        sellingpriceuzs: Math.round(sellingpriceuzs * 10000) / 10000,
        tradeprice: tradeprice ? Math.round(tradeprice * 10000) / 10000 : 0,
        tradepriceuzs: tradeprice
          ? Math.round(tradepriceuzs * 10000) / 10000
          : 0,
        market,
      });

      await newProductPrice.save();

      produc.price = newProductPrice._id;
      await produc.save();
    }

    let p = [];
    let t = 0;
    let tuzs = 0;

    const newIncomingConnector = new IncomingConnector({
      supplier: products[0].supplier._id,
      market,
      user,
    });

    await newIncomingConnector.save();

    for (const product of all) {
      await product.save();
      const produc = await Product.findById(product.product);
      produc.total = produc.total + product.pieces;
      await produc.save();

      const productprice = await ProductPrice.findOne({
        product: produc._id,
      });

      product.incomingconnector = newIncomingConnector._id;
      await product.save();
      p.push(product._id);
      t += Math.round(product.totalprice * 10000) / 10000;
      tuzs += Math.round(product.totalpriceuzs * 10000) / 10000;
    }

    newIncomingConnector.total = Math.round(t * 10000) / 10000;
    newIncomingConnector.totaluzs = Math.round(tuzs * 10000) / 10000;
    newIncomingConnector.incoming = p;

    // Qabulda tulanidigan qilish

    const productsId = products.map((product) => {
      return product.product._id;
    });

    // Create payment
    const newPayment = new IncomingPayment({
      totalprice: convertToUsd(payment.totalprice),
      totalpriceuzs: convertToUzs(payment.totalpriceuzs),
      payment: convertToUsd(payment.cash + payment.card + payment.transfer),
      paymentuzs: convertToUzs(
        payment.cashuzs + payment.carduzs + payment.transferuzs
      ),
      cash: payment.cash,
      cashuzs: payment.cashuzs,
      card: payment.card,
      carduzs: payment.carduzs,
      transfer: payment.transfer,
      transferuzs: payment.transferuzs,
      type: payment.type,
      comment: payment.comment,
      products: [...productsId],
      incomingconnector: newIncomingConnector._id,
      user,
      market,
    });
    await newPayment.save();

    // Create IncomingDailyConnector
    const newIncomingDailyConnector = new IncomingDailyConnector({
      id: 1,
      incomingconnector: newIncomingConnector._id,
      payment: newPayment._id,
      incomings: p,
      supplier: products[0].supplier._id,
      market,
      user,
    });
    await newIncomingDailyConnector.save();

    const id = await IncomingConnector.find({ market }).count();
    newIncomingConnector.id = 1000000 + id;

    newIncomingConnector.incomingdailyconnectors = [
      newIncomingDailyConnector._id,
    ];
    newIncomingConnector.payments = [newPayment._id];
    await newIncomingConnector.save();

    const connectors = await IncomingConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ _id: -1 })
      .select('supplier incoming total createdAt')
      .populate('supplier', 'name')
      .populate('incoming', 'pieces');

    res.status(201).send(connectors);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.addIncoming = async (req, res) => {
  try {
    const { market, payment, products, incomingconnectorid, user } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    let all = [];
    for (const newproduct of products) {
      delete newproduct.oldprice;
      delete newproduct.oldpriceuzs;
      const { error } = validateIncomingAll(newproduct);
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      const {
        product,
        unit,
        supplier,
        pieces,
        unitprice,
        totalprice,
        unitpriceuzs,
        totalpriceuzs,
        sellingprice,
        sellingpriceuzs,
      } = newproduct;

      const marke = await Market.findById(market);

      if (!marke) {
        return res.status(400).json({
          message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
        });
      }

      const produc = await Product.findById(product._id);

      if (!produc) {
        return res.status(400).json({
          message: `Diqqat! ${product.code} kodli mahsulot avval yaratilmagan.`,
        });
      }

      const unitt = await Unit.findById(unit._id);

      if (!unitt) {
        return res.status(400).json({
          message: `Diqqat! ${unit.name} o'lchov birligi tizimda mavjud emas.`,
        });
      }

      const newProduct = new Incoming({
        product: product._id,
        supplier: supplier._id,
        unit: unit._id,
        pieces,
        unitprice: Math.round(unitprice * 10000) / 10000,
        totalprice: Math.round(totalprice * 10000) / 10000,
        unitpriceuzs: Math.round(unitpriceuzs * 10000) / 10000,
        totalpriceuzs: Math.round(totalpriceuzs * 10000) / 10000,
        unit: unit._id,
        market,
        user,
      });

      all.push(newProduct);

      const newProductPrice = new ProductPrice({
        product: product._id,
        incomingprice: Math.round(unitprice * 10000) / 10000,
        incomingpriceuzs: Math.round(unitpriceuzs * 10000) / 10000,
        sellingprice: Math.round(sellingprice * 10000) / 10000,
        sellingpriceuzs: Math.round(sellingpriceuzs * 10000) / 10000,
        market,
      });

      await newProductPrice.save();

      produc.price = newProductPrice._id;
      await produc.save();
    }

    const incomingconnector = await IncomingConnector.findById(
      incomingconnectorid
    );

    let p = [];
    let t = 0;
    let tuzs = 0;

    for (const product of all) {
      await product.save();
      const produc = await Product.findById(product.product);
      produc.total = produc.total + product.pieces;
      await produc.save();

      const productprice = await ProductPrice.findOne({
        product: produc._id,
      });

      product.incomingconnector = incomingconnector._id;
      await product.save();
      p.push(product._id);
      t += Math.round(product.totalprice * 10000) / 10000;
      tuzs += Math.round(product.totalpriceuzs * 10000) / 10000;
    }

    incomingconnector.total = incomingconnector.total + t;
    incomingconnector.totaluzs = incomingconnector.totaluzs + tuzs;
    incomingconnector.incoming = [...incomingconnector.incoming, ...p];
    await incomingconnector.save();

    const productsId = products.map((product) => {
      return product.product._id;
    });

    const newDailyConnector = new IncomingDailyConnector({
      id: incomingconnector.incomingdailyconnectors.length,
      comment: payment.comment,
      incomingconnector: incomingconnector._id,
      products: p,
      supplier: products[0].supplier._id,
      market,
      user,
    });

    const newPayment = new IncomingPayment({
      totalprice: convertToUsd(payment.totalprice),
      totalpriceuzs: convertToUzs(payment.totalpriceuzs),
      payment: convertToUsd(payment.cash + payment.card + payment.transfer),
      paymentuzs: convertToUzs(
        payment.cashuzs + payment.carduzs + payment.transferuzs
      ),
      cash: payment.cash,
      cashuzs: payment.cashuzs,
      card: payment.card,
      carduzs: payment.carduzs,
      transfer: payment.transfer,
      transferuzs: payment.transferuzs,
      type: payment.type,
      comment: payment.comment,
      products: [...productsId],
      incomingconnector: incomingconnector._id,
      user,
      market,
    });
    await newPayment.save();

    newDailyConnector.payment = newPayment._id;
    await newDailyConnector.save();

    incomingconnector.payments = [
      ...incomingconnector.payments,
      newPayment._id,
    ];
    incomingconnector.incomingdailyconnectors = [
      ...incomingconnector.incomingdailyconnectors,
      newDailyConnector._id,
    ];
    await incomingconnector.save();

    const connectors = await IncomingConnector.findById(incomingconnectorid)
      .select('supplier incoming total totaluzs createdAt')
      .populate('supplier', 'name')
      .populate('incoming', 'pieces');

    return res.status(200).json(connectors);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.paymentDebt = async (req, res) => {
  try {
    const { payment, market, user, incomingconnectorid } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const incomingconnector = await IncomingConnector.findById(
      incomingconnectorid
    );

    const newPayment = new IncomingPayment({
      payment: payment.payment,
      paymentuzs: payment.paymentuzs,
      cash: payment.cash,
      cashuzs: payment.cashuzs,
      card: payment.card,
      carduzs: payment.carduzs,
      transfer: payment.transfer,
      transferuzs: payment.transferuzs,
      type: payment.type,
      comment: payment.comment,
      market,
      user,
      incomingconnector: incomingconnector._id,
    });

    await newPayment.save();

    incomingconnector.payments.push(newPayment._id);
    await incomingconnector.save();

    const response = await IncomingPayment.findById(newPayment._id).select(
      '-__v -updatedAt -isArchive'
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Incoming register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateIncoming(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const {
      totalprice,
      unitprice,
      pieces,
      product,
      category,
      unit,
      supplier,
      user,
      file,
      market,
    } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newIncoming = new Incoming({
      totalprice,
      unitprice,
      pieces,
      product,
      category,
      unit,
      supplier,
      user,
      file,
      market,
    });
    await newIncoming.save();

    const produc = await Product.findById(product);

    produc.total += parseInt(pieces);
    produc.incomingprice = Math.round(unitprice * 10000) / 10000;
    await produc.save();

    res.send(newIncoming);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Incoming update
module.exports.update = async (req, res) => {
  try {
    const { market, startDate, endDate, product } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const old = await Incoming.findById(product._id);

    if (!old) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kirim mahsuloti tizimda ro'yxatga olinmagan.",
      });
    }

    if (product.incomingconnector) {
      const incomingconnector = await IncomingConnector.findById(
        product.incomingconnector
      );

      incomingconnector.total = incomingconnector.total - old.totalprice;
      incomingconnector.total = incomingconnector.total + product.totalprice;
      incomingconnector.totaluzs =
        incomingconnector.totaluzs - old.totalpriceuzs;
      incomingconnector.totaluzs =
        incomingconnector.totaluzs + product.totalpriceuzs;
      await incomingconnector.save();
    } else {
      const incomingconnectors = await IncomingConnector.find().populate({
        path: 'incoming',
        match: { _id: product._id },
        select: '_id',
      });
      incomingconnectors.forEach(async (connector) => {
        if (connector.incoming.length > 0) {
          const incomingconnector = await IncomingConnector.findById(
            connector._id
          );

          incomingconnector.total = incomingconnector.total - old.totalprice;
          incomingconnector.total =
            incomingconnector.total + product.totalprice;

          await incomingconnector.save();
          await Incoming.findByIdAndUpdate(product._id, {
            incomingconnector: incomingconnector._id,
          });
        }
      });
    }

    const produc = await Product.findById(product.product._id);

    produc.total -= old.pieces;
    produc.total += product.pieces;
    await produc.save();

    const update = await Incoming.findByIdAndUpdate(product._id, {
      ...product,
    });

    const connectors = await IncomingConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ _id: -1 })
      .select('supplier incoming total createdAt')
      .populate('supplier', 'name')
      .populate('incoming', 'pieces');

    res.status(201).send(connectors);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { market, startDate, endDate, product } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const old = await Incoming.findById(product._id);

    if (!old) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kirim mahsuloti tizimda ro'yxatga olinmagan.",
      });
    }

    if (product.incomingconnector) {
      const incomingconnector = await IncomingConnector.findById(
        product.incomingconnector
      );

      incomingconnector.total = incomingconnector.total - product.totalprice;

      await incomingconnector.save();

      await IncomingConnector.findByIdAndUpdate(product.incomingconnector, {
        $pull: {
          incoming: new ObjectId(product._id),
        },
      });
    } else {
      const incomingconnectors = await IncomingConnector.find().populate({
        path: 'incoming',
        match: { _id: product._id },
        select: '_id',
      });
      incomingconnectors.forEach(async (connector) => {
        if (connector.incoming.length > 0) {
          const incomingconnector = await IncomingConnector.findById(
            connector._id
          );

          incomingconnector.total =
            incomingconnector.total - product.totalprice;

          await incomingconnector.save();

          await IncomingConnector.findByIdAndUpdate(connector._id, {
            $pull: {
              incoming: new ObjectId(product._id),
            },
          });
        }
      });
    }

    const produc = await Product.findById(product.product._id);

    produc.total -= old.pieces;
    await produc.save();

    await Incoming.findByIdAndDelete(product._id);
    const connectors = await IncomingConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ _id: -1 })
      .select('supplier incoming total createdAt')
      .populate('supplier', 'name')
      .populate('incoming', 'pieces');

    res.status(201).send(connectors);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Incoming getall
module.exports.get = async (req, res) => {
  try {
    const { market, beginDay, endDay, currentPage, countPage, search } =
      req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const productcode = new RegExp(
      '.*' + search ? search.code : '' + '.*',
      'i'
    );
    const productname = new RegExp(
      '.*' + search ? search.name : '' + '.*',
      'i'
    );

    const suppliername = new RegExp(
      '.*' + search ? search.supplier : '' + '.*',
      'i'
    );

    const incomings = await Incoming.find({
      market,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    })
      .sort({ _id: -1 })
      .select('-isArchive -updatedAt -market -user -__v')
      .populate({
        path: 'supplier',
        match: { name: suppliername },
        select: 'name',
      })
      .populate({
        path: 'product',
        select: 'productdata',
        populate: {
          path: 'productdata',
          match: { code: productcode, name: productname },
          select: 'name code barcode',
        },
      })
      .populate({
        path: 'product',
        select: 'price',
        populate: {
          path: 'price',
          select: 'sellingprice sellingpriceuzs',
        },
      })
      .populate('unit', 'name');

    let filter = incomings.filter((incoming) => {
      return (
        incoming.supplier !== null && incoming.product.productdata !== null
      );
    });

    const count = filter.length;

    filter = filter.splice(currentPage * countPage, countPage);

    res.status(201).send({
      incomings: filter,
      count: count,
    });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Incoming getall
module.exports.getexcel = async (req, res) => {
  try {
    const { market, beginDay, endDay } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const incomings = await Incoming.find({
      market,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    })
      .sort({ _id: -1 })
      .select('-isArchive -updatedAt -market -user -__v')
      .populate('supplier', 'name')
      .populate({
        path: 'product',
        select: 'productdata',
        populate: {
          path: 'productdata',
          select: 'name code',
        },
      })
      .populate('unit', 'name');
    res.status(201).send(incomings);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

//Incoming registerall
module.exports.getConnectors = async (req, res) => {
  try {
    const { market, beginDay, endDay } = req.body;
    const connectors = await IncomingConnector.find({
      market,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    })
      .sort({ _id: -1, supplier: -1 })
      .select('supplier incoming total totaluzs createdAt payments')
      .populate('supplier', 'name')
      .populate('payments', 'totalprice totalpriceuzs payment paymentuzs')
      .populate('incoming', 'pieces');

    const reducer = (arr, key) =>
      arr.reduce((prev, item) => prev + (item[key] || 0), 0);

    const response = connectors.map((connector) => {
      const totalpayment = reducer(connector.payments, 'payment');
      const totalpaymentuzs = reducer(connector.payments, 'paymentuzs');
      const debt = connector.total - totalpayment;
      const debtuzs = connector.totaluzs - totalpaymentuzs;

      return {
        _id: connector._id,
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

    res.status(200).json(response);
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};

// Pagination
module.exports.getCount = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(400)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }

    const count = await Incoming.find({ market }).count();
    res.status(201).send({ count });
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' });
  }
};
