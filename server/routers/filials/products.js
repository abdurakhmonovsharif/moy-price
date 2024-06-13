const { filter, matches } = require("lodash");
const { Transfer } = require("../../models/FilialProducts/Transfer");
const {
  TransferProduct,
} = require("../../models/FilialProducts/TransferProduct");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Category } = require("../../models/Products/Category");
const { Product } = require("../../models/Products/Product");
const { ProductData } = require("../../models/Products/Productdata");
const { ProductPrice } = require("../../models/Products/ProductPrice");
const { Unit } = require("../../models/Products/Unit");
const { User } = require("../../models/Users");

const createFilialCategory = async (filial, product) => {
  const filialCategory = await Category.findOne({
    market: filial,
    code: product.category.code,
  });
  if (filialCategory) {
    return filialCategory;
  } else {
    const newFilialCategory = new Category({
      code: product.category.code,
      market: filial,
    });
    if (product.category.name) {
      newFilialCategory.name = product.category.name;
    }
    await newFilialCategory.save();
    return newFilialCategory;
  }
};

const createFilialUnit = async (filial, product) => {
  const filialUnit = await Unit.findOne({
    market: filial,
    name: product.unit.name,
  });
  if (filialUnit) {
    return filialUnit;
  } else {
    const newFilialUnit = new Unit({
      name: product.unit.name,
      market: filial,
    });
    await newFilialUnit.save();
    return newFilialUnit;
  }
};
// Send Products To Filial
module.exports.registerProducts = async (req, res) => {
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

    const newTransfer = new Transfer({
      market,
      filial,
    });

    const count = await Transfer.find({
      market,
    }).count();

    newTransfer.id = 1000001 + count;

    await newTransfer.save();

    for (const product of products) {
      // O'tkazma mahsulotlar datasi
      const { incomingprice, incomingpriceuzs, sellingprice, sellingpriceuzs } =
        product.price;

      const transferPrice = new ProductPrice({
        incomingprice,
        incomingpriceuzs,
        sellingprice,
        sellingpriceuzs,
        tradeprice: product.tradeprice,
        tradepriceuzs: product.tradepriceuzs,
        market,
      });
      await transferPrice.save();

      const newTransferProduct = new TransferProduct({
        product: product._id,
        productdata: product.productdata._id,
        category: product.category._id,
        unit: product.unit._id,
        pieces: product.total,
        transfer: newTransfer._id,
        price: transferPrice._id,
        barcode: product.productdata.barcode,
        market,
        filial,
      });
      await newTransferProduct.save();

      transferPrice.product = newTransferProduct._id;
      await transferPrice.save();

      newTransfer.products.push(newTransferProduct._id);
      await newTransfer.save();

      // Bosh do'kondan mahsulotlar sonini ayirish
      const sellerProduct = await Product.findOne({ _id: product._id, market });
      sellerProduct.total = sellerProduct.total - product.total;
      await sellerProduct.save();

      // kategoriya bulsa || bulmasa
      const filialCategory = await createFilialCategory(filial, product);

      // Filialda mahsulot borligini tekshirish va qo'shish
      const filialProductData = await ProductData.findOne({
        code: product.productdata.code,
        market: filial,
        category: filialCategory._id,
      });

      if (filialProductData) {
        // filialda mahsulot bor bulsa
        const filialProduct = await Product.findOne({
          productdata: filialProductData._id,
          market: filial,
        });

        filialProduct.total = filialProduct.total + product.total;
        filialProduct.minimumcount = product.minimumcount;

        // const filialproductPrice = await ProductPrice.findById(filialProduct.price)
        // filialproductPrice.incomingprice = Number(incomingprice)
        // filialproductPrice.incomingpriceuzs = Number(incomingpriceuzs)
        // filialproductPrice.sellingprice = Number(sellingprice)
        // filialproductPrice.sellingpriceuzs = Number(sellingpriceuzs)
        // filialproductPrice.save();

        await filialProduct.save();

        newTransferProduct.filialproduct = filialProduct._id;
        await newTransferProduct.save();

        // Filialda mahsulot barcode tekshirish va qushish
        if (!filialProductData.barcode) {
          filialProductData.barcode = product.productdata.barcode;
          await filialProductData.save();
        }

        //Filialda mahsulot optom narxini tekshirish
        const filialProductPrice = await ProductPrice.findById(
          filialProduct.price
        );
        if (!filialProductPrice.tradeprice) {
          filialProductPrice.tradeprice = product.price.tradeprice;
          filialProductPrice.tradepriceuzs = product.price.tradepriceuzs;
          await filialProductPrice.save();
        }
      } else {
        // filialda mahsulot yuq bulsa

        // O'lchov birligi bulsa bulmasa
        const filialUnit = await createFilialUnit(filial, product);

        // Filialga yangi mahsulot yaratish
        const filialNewProductData = new ProductData({
          name: product.productdata.name,
          code: product.productdata.code,
          category: filialCategory._id,
          unit: filialUnit._id,
          barcode: product.productdata.barcode,
          market: filial,
        });
        await filialNewProductData.save();

        const filialNewProduct = new Product({
          productdata: filialNewProductData._id,
          unit: filialUnit._id,
          category: filialCategory._id,
          market: filial,
          minimumcount: product.minimumcount,
          total: product.total,
        });
        await filialNewProduct.save();

        // Mahsulotga yangi narx yaratish
        const filialPrice = new ProductPrice({
          incomingprice,
          incomingpriceuzs,
          sellingprice,
          sellingpriceuzs,
          market: filial,
          product: filialNewProduct._id,
          tradeprice: product.price.tradeprice,
          tradepriceuzs: product.price.tradepriceuzs,
        });
        await filialPrice.save();

        filialNewProductData.products.push(filialNewProduct._id);
        await filialNewProductData.save();

        filialNewProduct.price = filialPrice._id;
        await filialNewProduct.save();

        newTransfer.filialproduct = filialNewProduct._id;
        await newTransfer.save();
      }
    }

    const total = {
      pieces: 0,
      totalincoming: 0,
      totalincominguzs: 0,
      totalselling: 0,
      totalsellinguzs: 0,
    };
    products.map((product) => {
      total.pieces += product.total;
      total.totalincoming += product.price.incomingprice;
      total.totalincominguzs += product.price.incomingpriceuzs;
      total.totalselling += product.price.sellingprice;
      total.totalsellinguzs += product.price.sellingpriceuzs;
    });

    newTransfer.pieces = total.pieces;
    newTransfer.totalincomingprice = total.totalincoming;
    newTransfer.totalincomingpriceuzs = total.totalincominguzs;
    newTransfer.totalsellingprice = total.totalselling;
    newTransfer.totalsellingpriceuzs = total.totalsellinguzs;

    await newTransfer.save();

    const responseTransfer = await Transfer.findById(newTransfer._id);

    res.status(200).json(responseTransfer);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Edit Sended Products
module.exports.editTransfer = async (req, res) => {
  try {
    const {
      market,
      filial,
      transferproduct,
      currentPage,
      countPage,
      startDate,
      endDate,
    } = req.body;

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

    const {
      _id,
      product,
      productdata,
      unit,
      category,
      price,
      pieces,
      filialproduct,
    } = transferproduct;

    const oldTransferProduct = await TransferProduct.findById(_id)
      .select("-__v -updatedAt -isArchive")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs"
      );

    const { incomingprice, incomingpriceuzs, sellingprice, sellingpriceuzs } =
      price;

    const transfer = await Transfer.findById(oldTransferProduct.transfer);
    transfer.pieces = transfer.pieces - oldTransferProduct.pieces + pieces;
    transfer.totalincomingprice =
      transfer.totalincomingprice -
      oldTransferProduct.price.incomingprice +
      incomingprice;
    transfer.totalincomingpriceuzs =
      transfer.totalincomingpriceuzs -
      oldTransferProduct.price.incomingpriceuzs +
      incomingpriceuzs;
    transfer.totalsellingrprice =
      transfer.totalsellingrprice -
      oldTransferProduct.price.sellingprice +
      sellingprice;
    transfer.totalsellingrprice =
      transfer.totalsellingrpriceuzs -
      oldTransferProduct.price.sellingpriceuzs +
      sellingpriceuzs;

    const marketProduct = await Product.findById(product);
    marketProduct.total =
      marketProduct.total + oldTransferProduct.pieces - pieces;
    await marketProduct.save();

    await ProductPrice.findByIdAndUpdate(oldTransferProduct.price._id, {
      incomingprice,
      incomingpriceuzs,
      sellingprice,
      sellingpriceuzs,
    });

    await TransferProduct.findByIdAndUpdate(_id, {
      pieces: pieces,
    });

    const filialProduct = await Product.findById(filialproduct);
    filialProduct.pieces =
      filialProduct.pieces - oldTransferProduct.pieces + pieces;
    await filialProduct.save();

    const responseTransferProducts = await TransferProduct.find({
      market,
      filial,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("-__v -isArchive -updatedAt")
      .populate("productdata", "code name")
      .populate("category", "code")
      .populate("unit", "name")
      .populate(
        "price",
        "incomingprice incomingpriceuzs sellingprice sellingpriceuzs"
      );

    res.status(201).json({
      count: responseTransferProducts.length,
      data: responseTransferProducts.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Delete TransferProduct
module.exports.deleteTransfer = async (req, res) => {
  try {
    const { _id, market, filial, startDate, endDate, currentPage, countPage } =
      req.body;

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

    const transferProduct = await TransferProduct.findById(_id);

    const marketProduct = await Product.findById(transferProduct.product);
    await Product.findByIdAndUpdate(marketProduct._id, {
      total: marketProduct.total + transferProduct.pieces,
    });

    const filialProduct = await Product.findById(transferProduct.filialproduct);
    await Product.findByIdAndUpdate(filialProduct._id, {
      total: filialProduct.total - transferProduct.pieces,
    });

    await TransferProduct.findByIdAndDelete(_id);
    await ProductPrice.findByIdAndDelete(transferProduct.price);

    const response = await TransferProduct.find({
      market,
      filial,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("-__v -updatedAt -isArchive")
      .populate("productdata", "code name")
      .populate("category", "code")
      .populate("unit", "name")
      .populate(
        "price",
        "incomingprice incomingpriceuzs sellingprice sellingpriceuzs"
      );

    res.status(200).json({
      count: response.length,
      data: response.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Get Transfers
module.exports.getTransfers = async (req, res) => {
  try {
    const { market, filial, currentPage, countPage, startDate, endDate } =
      req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const transfers = await Transfer.find({
      market,
      filial: filial ? filial : { $exists: true },
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).select(
      "market filial id products createdAt totalincomingprice totalincomingpriceuzs totalsellingprice totalsellingpriceuzs pieces"
    );

    res.status(200).json({
      count: transfers.length,
      data: transfers.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Get TransferProducts
module.exports.getTransferProducts = async (req, res) => {
  try {
    const { market, transfer, currentPage, countPage } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const transferProducts = await TransferProduct.find({
      market,
      transfer,
    })
      .select("-__v -updatedAt -isArchive")
      .populate("productdata", "code name")
      .populate("category", "code")
      .populate("unit", "name")
      .populate(
        "price",
        "incomingprice incomingpriceuzs sellingprice sellingpriceuzs"
      );

    return res.status(200).json({
      count: transferProducts.length,
      data: transferProducts.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Get TransferProducts
module.exports.getIncomeProducts = async (req, res) => {
  try {
    const { market, filial, currentPage, countPage } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const transferProducts = await TransferProduct.find({
      market: filial,
    })
      .select("-__v -updatedAt -isArchive")
      .populate("productdata", "code name barcode")
      .populate("category", "code")
      .populate("unit", "name")
      .populate(
        "price",
        "incomingprice incomingpriceuzs sellingprice sellingpriceuzs"
      );

    return res.status(200).json({
      count: transferProducts.length,
      products: transferProducts.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Get Filials List
module.exports.getFilials = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(404).json({
        error:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");

    const filials = await Market.find({
      mainmarket: market,
      name: name,
    })
      .select("director image name phone1 createdAt")
      .populate("director", "firstname lastname");

    res.status(201).json({
      count: filials.length,
      filials: filials.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Get AllFilials List
module.exports.getAllFilials = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(404).json({
        error: "Diqqat! Do'kon dasturda ro'yxatga olinmagan.",
      });
    }
    const filials = await Market.find({
      mainmarket: market,
    })
      .select("director image name phone1 createdAt")
      .populate("director", "firstname lastname");
    res.status(201).json({
      filials,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.filialProducts = async (req, res) => {
  try {
    const { filial, productcode, categorycode } = req.body;

    const marke = await Market.findById(filial);
    if (!marke) {
      return res.status(404).json({
        error: "Diqqat! Do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const category = await Category.findOne({
      market: filial,
      code: categorycode,
    });
    const productdata = await ProductData.findOne({
      market: filial,
      category: category._id,
      code: productcode,
    });
    const product = await Product.findOne({
      market: filial,
      productdata: productdata._id,
    }).select("total");

    res.status(200).json({ total: product.total });
  } catch (error) {
    res
      .status(501)
      .json({
        error: "Serverda xatolik yuz berdi...",
        description: error.message,
      });
  }
};

// getFilials For sale
module.exports.getFilialsForSale = async (req, res) => {
  try {
    const { marketData } = req.body;

    const marke = await Market.findById(marketData._id);
    if (!marke) {
      return res.status(404).json({
        error: "Diqqat! Do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    let markets = [];

    if (marketData.mainmarket) {
      const filials = await Market.find({
        mainmarket: marketData.mainmarket,
      })
        .select("name")
        .lean()
        .then((filials) => filials.filter((f) => f._id !== marketData._id));
      const mainmarket = await Market.findById(marketData.mainmarket)
        .select("name")
        .lean();
      markets = [...filials, mainmarket];
    } else {
      const mainmarket = await Market.findById(marketData._id)
        .select("filials name")
        .populate("filials", "name")
        .lean();
      markets = [mainmarket, ...mainmarket.filials];
    }

    res.status(200).json({ filials: markets });
  } catch (error) {
    res
      .status(501)
      .json({
        error: "Serverda xatolik yuz berdi...",
        description: error.message,
      });
  }
};
