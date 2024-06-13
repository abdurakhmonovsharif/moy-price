const {
  Market,
  Connection,
  TemporaryOrders,
  OrderProduct,
  OrderConnector,
  Product,
  Category,
  ProductData,
  Unit,
} = require("../constants.js").models;
const { validateOrderProduct } = require("../constants.js").validators;
const { map, filter } = require("lodash");
const {
  validateSendingOrderProduct,
} = require("../../models/Orders/OrderProduct.js");
const {
  createCategory,
  createUnit,
  createProductData,
  createProduct,
  createProductPrice,
} = require("../globalFunctions.js");

// Buyurtma berish
const registerOrder = async (req, res) => {
  try {
    const { market, products, partner } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(400).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    map(products, (product) => {
      const { error } = validateOrderProduct(product);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    });

    let newProducts = [];
    let totalPrice = 0;
    let totalPriceUzs = 0;

    for (const product of products) {
      const orderProduct = new OrderProduct({
        sender: product.sender,
        market,
        product: product.product._id,
        pieces: { recived: product.pieces.recived },
        unitprice: product.unitprice,
        unitpriceuzs: product.unitpriceuzs,
        totalprice: product.totalprice,
        totalpriceuzs: product.totalpriceuzs,
      });
      await orderProduct.save();
      totalPrice += orderProduct.totalprice;
      totalPriceUzs += orderProduct.totalpriceuzs;
      newProducts.push(orderProduct._id);
    }

    const countOfOrders = await OrderConnector.find({ market }).count();

    const orderConnector = new OrderConnector({
      id: countOfOrders + 1000001,
      market,
      sender: partner,
      products: newProducts,
      position: "requested",
      totalprice: totalPrice,
      totalpriceuzs: totalPriceUzs,
    });
    await orderConnector.save();
    const order = await OrderConnector.findById(orderConnector._id)
      .select("products id position createdAt totalprice totalpriceuzs")
      .populate({
        path: "products",
        populate: {
          path: "product",
          select: "name code",
          populate: { path: "productdata category unit", select: "name code" },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
      });

    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { market, products, orderId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(400).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    map(products, (product) => {
      const { error } = validateOrderProduct(product);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    });

    const orderData = await OrderConnector.findById(orderId);
    map(orderData.products, async (product) => {
      await OrderProduct.findByIdAndDelete(product);
    });

    let newProducts = [];
    let totalPrice = 0;
    let totalPriceUzs = 0;

    for (const product of products) {
      const orderProduct = new OrderProduct({
        sender: product.sender,
        market,
        product: product.product._id,
        pieces: { ...product.pieces },
        unitprice: product.unitprice,
        unitpriceuzs: product.unitpriceuzs,
        totalprice: product.totalprice,
        totalpriceuzs: product.totalpriceuzs,
      });
      await orderProduct.save();
      totalPrice += orderProduct.totalprice;
      totalPriceUzs += orderProduct.totalpriceuzs;
      newProducts.push(orderProduct._id);
    }

    orderData.products = newProducts;
    orderData.totalprice = totalPrice;
    orderData.totalpriceuzs = totalPriceUzs;

    await orderData.save();
    const order = await OrderConnector.findById(orderId)
      .select("products id position createdAt totalprice totalpriceuzs")
      .populate({
        path: "products",
        populate: {
          path: "product",
          select: "name code",
          populate: { path: "productdata category unit", select: "name code" },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
      });

    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { market, countPage, currentPage, search, startDate, endDate } =
      req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }

    const id = new RegExp(
      ".*" + search ? search.id.toString() : "" + ".*",
      "i"
    );
    const name = new RegExp(
      ".*" + search ? search.name.toString() : "" + ".*",
      "i"
    );
    const inn = new RegExp(
      ".*" + search ? search.inn.toString() : "" + ".*",
      "i"
    );
    const orders = await OrderConnector.find({
      market,
      id: id,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .select(
        "products id position createdAt totalprice totalpriceuzs position"
      )
      .populate({
        path: "products",
        populate: {
          path: "product",
          populate: {
            path: "category productdata unit total price",
            select: "name code sellingprice",
          },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
        match: { name: name },
      });
    const filteredOrders = filter(orders, (order) => order.sender !== null);
    const count = filteredOrders.length;
    res.status(200).json({
      orders: filteredOrders.splice(currentPage * countPage, countPage),
      count,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deliveredOrder = async (req, res) => {
  try {
    const { market, products, orderId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(400).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    for (const product of products) {
      const { error } = validateOrderProduct(product);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      if (product.pieces.send < product.pieces.delivered) {
        return res.status(400).json({
          message: `Qabul qilingan miqdor jo'natilgan miqdordan katta bo'lishi mumkin emas`,
        });
      }
    }

    let totalPrice = 0;
    let totalPriceUzs = 0;
    for (const product of products) {
      const orderProduct = await OrderProduct.findById(product._id);
      await OrderProduct.findByIdAndUpdate(product._id, {
        pieces: {
          recived: product.pieces.recived,
          send: product.pieces.send,
          delivered: product.pieces.delivered,
          returned: product.pieces.send - product.pieces.delivered,
        },
        totalprice: product.totalprice,
        totalpriceuzs: product.totalpriceuzs,
      });
      totalPrice += product.totalprice;
      totalPriceUzs += product.totalpriceuzs;

      const productData = await Product.findById(product.product._id)
        .populate({
          path: "productdata",
          select: "code name barcode",
        })
        .populate({ path: "category", select: "code name" })
        .populate({ path: "unit", select: "name" });

      // Categoriyani olish
      let category = await Category.findOne({
        market,
        code: productData.category.code,
      });
      if (!category) {
        category = await createCategory({
          market,
          code: productData.category.code,
          name: productData.category.name,
        });
      }

      // ProductData ni olish
      let productdata = await ProductData.findOne({
        market,
        code: productData.productdata.code,
        category: category._id,
      });

      if (!productdata) {
        let unit = await Unit.findOne({
          market,
          name: productData.unit.name,
        });
        if (!unit) {
          unit = createUnit({
            market,
            name: productData.unit.name,
          });
        }
        productdata = await createProductData({
          market,
          code: productData.productdata.code,
          name: productData.productdata.name,
          barcode: productData.productdata.barcode,
          unit: unit._id,
          category: category._id,
        });
        const newProduct = await createProduct({
          market,
          category: category._id,
          productdata: productdata._id,
          unit: unit._id,
          total: product.pieces.delivered,
          minimumcount: 1,
        });
        const productPrice = await createProductPrice({
          market,
          product: newProduct._id,
          sellingprice: 0,
          sellingpriceuzs: 0,
          incomingpriceuzs: product.unitpriceuzs,
          incomingprice: product.unitprice,
          tradeprice: 0,
          tradepriceuzs: 0,
        });

        newProduct.price = productPrice._id;
        await newProduct.save();
        productdata.product = newProduct._id;
        productdata.unit = unit._id;
        await productdata.save();
      } else {
        const currentProduct = await Product.findById(productdata.product);
        currentProduct.total -= orderProduct.pieces.delivered;
        currentProduct.total += product.pieces.delivered;
        await currentProduct.save();
      }
    }

    await OrderConnector.findByIdAndUpdate(orderId, {
      position: "delivered",
      totalpriceuzs: totalPriceUzs,
      totalprice: totalPrice,
    });

    const order = await OrderConnector.findById(orderId)
      .select("products id position createdAt totalprice totalpriceuzs")
      .populate({
        path: "products",
        populate: {
          path: "product",
          select: "name code",
          populate: { path: "productdata category unit", select: "name code" },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
      });

    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Buyurtma olish
const getIncomingOrders = async (req, res) => {
  try {
    const { market, countPage, currentPage, search, startDate, endDate } =
      req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }

    const id = new RegExp(
      ".*" + search ? search.id.toString() : "" + ".*",
      "i"
    );
    const name = new RegExp(
      ".*" + search ? search.name.toString() : "" + ".*",
      "i"
    );
    const inn = new RegExp(
      ".*" + search ? search.inn.toString() : "" + ".*",
      "i"
    );
    const orders = await OrderConnector.find({
      sender: market,
      id: id,
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .sort({ createdAt: -1 })
      .select(
        "products id position createdAt totalprice totalpriceuzs position"
      )
      .populate({
        path: "products",
        populate: {
          path: "product",
          populate: {
            path: "category productdata unit total price",
            select: "name code sellingprice incomingprice incomingpriceuzs",
          },
        },
      })
      .populate({
        path: "market",
        select: "name inn",
        match: { name: name },
      });
    const filteredOrders = filter(orders, (order) => order.sender !== null);
    const count = filteredOrders.length;
    res.status(200).json({
      orders: filteredOrders.splice(currentPage * countPage, countPage),
      count,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOrderPosition = async (req, res) => {
  try {
    const { market, orderId, position } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    await OrderConnector.findByIdAndUpdate(orderId, { position })

    const order = await OrderConnector.findById(orderId)
      .select(
        "products id position createdAt totalprice totalpriceuzs position"
      )
      .populate({
        path: "products",
        populate: {
          path: "product",
          populate: {
            path: "category productdata unit total price",
            select: "name code sellingprice",
          },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
      });

    for (const product of order.products) {
      const returnedProduct = await Product.findById(product.product);
      returnedProduct.total = returnedProduct.total + product.pieces.returned
      await returnedProduct.save();
    }

    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const sendingProducts = async (req, res) => {
  try {
    const { market, products, orderId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(400).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }

    for (const product of products) {
      const { error } = validateSendingOrderProduct(product);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const updateProduct = await Product.findByIdAndUpdate(
        product.product._id
      );
      if (updateProduct.total < product.pieces.send)
        return res.status(400).json({
          message: `Omborda ${product.product.code} kodli mahsulotdan yetarlicha mavjud emas`,
        });
    }

    const orderConnector = await OrderConnector.findById(orderId).populate({
      path: "products",
      select: "pieces product",
      populate: { path: "product", select: "total" },
    });

    map(orderConnector.products, async (product) => {
      await Product.findByIdAndUpdate(product.product._id, {
        total: product.product.total + product.pieces.send,
      });
    });

    let newProducts = [];
    let totalPrice = 0;
    let totalPriceUzs = 0;

    for (const product of products) {
      const orderProduct = new OrderProduct({
        sender: market,
        market: product.market,
        product: product.product._id,
        pieces: { ...product.pieces },
        unitprice: product.unitprice,
        unitpriceuzs: product.unitpriceuzs,
        totalprice: product.totalprice,
        totalpriceuzs: product.totalpriceuzs,
      });
      await orderProduct.save();
      const updateProduct = await Product.findByIdAndUpdate(
        product.product._id
      );
      updateProduct.total = updateProduct.total - product.pieces.send;
      await updateProduct.save();
      totalPrice += product.totalprice;
      totalPriceUzs += product.totalpriceuzs;
      newProducts.push(orderProduct._id);
    }
    orderConnector.products = newProducts;
    orderConnector.position = "send";
    orderConnector.totalprice = totalPrice;
    orderConnector.totalpriceuzs = totalPriceUzs;

    await orderConnector.save();
    const order = await OrderConnector.findById(orderConnector._id)
      .select("products id position createdAt totalprice totalpriceuzs")
      .populate({
        path: "products",
        populate: {
          path: "product",
          select: "name code",
          populate: { path: "productdata category unit", select: "name code" },
        },
      })
      .populate({
        path: "market",
        select: "name inn",
      });

    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const completedOrderTransfer = async (req, res) => {
  try {
    const { market, orderId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }

    const orderConnector = await OrderConnector.findById(orderId).populate({
      path: "products",
      populate: { path: "product", select: "total" },
    });
    for (const product of orderConnector.products) {
    }
    const order = await OrderConnector.findById(orderId)
      .select(
        "products id position createdAt totalprice totalpriceuzs position"
      )
      .populate({
        path: "products",
        populate: {
          path: "product",
          populate: {
            path: "category productdata unit total price",
            select: "name code sellingprice",
          },
        },
      })
      .populate({
        path: "sender",
        select: "name inn",
      });
    res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Vaqtincha saqlangan buyurtmalar
const registerTemporaryOrder = async (req, res) => {
  try {
    const { market, temporary } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    const temporaryOrder = new TemporaryOrders({
      market,
      temporary,
    });
    await temporaryOrder.save();
    res.status(200).json({ message: "Buyurtma muvaffaqqiyatli saqlandi!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getTemporaryOrders = async (req, res) => {
  try {
    const { market } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    const temporaryOrders = await TemporaryOrders.find({ market }).sort({
      createdAt: -1,
    });
    if (!temporaryOrders) {
      return res
        .status(404)
        .json({ message: "Saqlangan buyurtmalar topilmadi" });
    }
    res.status(200).json(temporaryOrders);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteTemporaryOrders = async (req, res) => {
  try {
    const { market, temporaryId } = req.body;
    const marketData = await Market.findById(market);
    if (!marketData) {
      return res.status(404).json({ message: "Do'kon ma'lumotlari topilmadi" });
    }
    await TemporaryOrders.findByIdAndDelete(temporaryId);
    res
      .status(200)
      .json({ message: "Saqlangan buyurtma muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerOrder,
  updateOrder,
  getOrders,
  getIncomingOrders,
  sendingProducts,
  updateOrderPosition,
  registerTemporaryOrder,
  getTemporaryOrders,
  deleteTemporaryOrders,
  deliveredOrder,
};
