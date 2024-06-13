const { Product } = require("../../models/Products/Product");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Category } = require("../../models/Products/Category");
const { ProductType } = require("../../models/Products/ProductType");
const { Unit } = require("../../models/Products/Unit");
const { Brand } = require("../../models/Products/Brand");
const { ProductPrice } = require("../../models/Products/ProductPrice");
const {
  InventoryConnector,
} = require("../../models/Inventory/InventoriesConnector");
const { Inventory } = require("../../models/Inventory/Inventory");
const { ProductData } = require("../../models/Products/Productdata");

//Product for Inventory
module.exports.getProductsInventory = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }
    const productcode = new RegExp(
      ".*" + search ? search.code : "" + ".*",
      "i"
    );
    const productname = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const productcategory = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );

    const products = await Product.find({
      market,
      isArchive: false,
    })
      .sort({ code: 1 })
      .select("total market unit price")
      .populate({
        path: "productdata",
        select: "name code",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "code",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    const filter = products.filter((product) => {
      return product.productdata !== null && product.category !== null;
    });

    const count = filter.length;

    const sendingProducts = filter.splice(currentPage * countPage, countPage);

    let inventoryConnector = await InventoryConnector.findOne({
      market,
      completed: false,
    });
    let inventoryConnectorCount = await InventoryConnector.find({
      market,
    }).count();

    if (!inventoryConnector) {
      inventoryConnector = new InventoryConnector({
        id: "INV-" + (inventoryConnectorCount + 1),
        market,
      });
      await inventoryConnector.save();
    }

    for (const i in sendingProducts) {
      let inventory = await Inventory.findOne({
        market,
        inventoryConnector: inventoryConnector._id,
        product: sendingProducts[i]._id,
      }).select("-__iv -updatedAt -createdAt -isArchive");

      inventory
        ? (sendingProducts[i] = {
            ...sendingProducts[i]._doc,
            inventory,
          })
        : (sendingProducts[i] = {
            ...sendingProducts[i]._doc,
            inventory: {
              market,
              inventoryConnector: inventoryConnector._id,
              product: sendingProducts[i]._id,
              price: sendingProducts[i].price._id,
              unit: sendingProducts[i].unit._id,
              productdata: sendingProducts[i].productdata._id,
            },
          });
          
    }
    

    res.status(201).json({
      products: sendingProducts,
      count,
    });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

//Product for Inventory
module.exports.updateInventory = async (req, res) => {
  try {
    const { market, inventory, search, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi" });
    }
    if (!inventory.inventorycount || inventory.inventorycount < 0) {
      return res.status(401).json({
        message:
          "Diqqat! Inventarizatsiya qiymatlari kiritilmagan yoki xato kiritilmoqda",
      });
    }
    const inventoryConnector = await InventoryConnector.findById(
      inventory.inventoryConnector
    );
    if (!inventory._id) {
      const newinventory = new Inventory({
        ...inventory,
      });

      await newinventory.save();

      inventoryConnector.inventories.push(newinventory._id);
      await inventoryConnector.save();
    } else await Inventory.findByIdAndUpdate(inventory._id, inventory);

    const productcode = new RegExp(
      ".*" + search ? search.code : "" + ".*",
      "i"
    );
    const productname = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const productcategory = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );

    const products = await Product.find({
      market,
      isArchive: false,
    })
      .sort({ code: 1 })
      .select("total market unit price")
      .populate({
        path: "productdata",
        select: "name code",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "code",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    const filter = products.filter((product) => {
      return product.productdata !== null && product.category !== null;
    });

    const count = filter.length;

    const sendingProducts = filter.splice(currentPage * countPage, countPage);

    for (const i in sendingProducts) {
      let inventory = await Inventory.findOne({
        market,
        inventoryConnector: inventoryConnector._id,
        product: sendingProducts[i]._id,
      }).select("-__iv -updatedAt -createdAt -isArchive");
      inventory
        ? (sendingProducts[i] = {
            ...sendingProducts[i]._doc,
            inventory,
          })
        : (sendingProducts[i] = {
            ...sendingProducts[i]._doc,
            inventory: {
              market,
              inventoryConnector: inventoryConnector._id,
              product: sendingProducts[i]._id,
              price: sendingProducts[i].price._id,
              unit: sendingProducts[i].unit._id,
              productdata: sendingProducts[i].productdata._id,
            },
          });
    }
    res.status(201).json({
      products: sendingProducts,
      count,
    });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

//Product for Inventory
module.exports.completed = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }
    const inventoryConnector = await InventoryConnector.findOne({
      market,
      completed: false,
    })
      .select("inventories completed")
      .populate("inventories", "product inventorycount productcount");

    inventoryConnector.inventories.forEach(async (inventory) => {
      await Product.findByIdAndUpdate(inventory.product, {
        total: inventory.inventorycount,
      });
    });

    inventoryConnector.completed = true;
    await inventoryConnector.save();

    res.status(201).json({ message: "Inventarizatsiya jarayoni yakunlandi" });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

//Product for Inventory
module.exports.inventoryconnetors = async (req, res) => {
  try {
    const { market, startDate, endDate, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }

    const count = await InventoryConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).count();

    const inventoryConnectors = await InventoryConnector.find({
      market,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select("inventories createdAt completed id")
      .sort({ _id: -1 })
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ connectors: inventoryConnectors, count });
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

//Product for Inventory
module.exports.inventoryproducts = async (req, res) => {
  try {
    const { market, id } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(500)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }
    const inventoriesConnector = await InventoryConnector.findById(id);

    const inventories = await Inventory.find({
      inventoryConnector: id,
      market,
    })
      .select("inventorycount productcount createdAt comment")
      .populate("productdata", "name code")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs"
      );

    res.status(201).json({ inventories, inventoriesConnector });
  } catch (error) {
    res.status(401).json({ message: "Serverda xatolik yuz berdi..." });
  }
};
