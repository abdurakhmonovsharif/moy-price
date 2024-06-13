const {
  ProductType,
  validateProductType,
} = require("../../models/Products/ProductType");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Category } = require("../../models/Products/Category");
const { Product } = require("../../models/Products/Product");
const ObjectId = require("mongodb").ObjectId;

// //ProductType registerall
// module.exports.registerAll = async (req, res) => {
//   try {
//     const productstype = req.body
//     const all = []
//     for (const s of productstype) {
//       const { error } = validateProductType(s)
//       if (error) {
//         return res.status(400).json({
//           error: error.message,
//         })
//       }

//       const { name, category, market } = s

//       const marke = await Market.findOne({ name: market })

//       if (!marke) {
//         return res.status(400).json({
//           message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
//         })
//       }

//       const departmen = await Category.findOne({
//         name: category,
//         market: marke._id,
//       })

//       if (!departmen) {
//         return res.status(400).json({
//           message: `Diqqat! ${category} xizmat turi mavjud emas.`,
//         })
//       }

//       const producttype = await ProductType.findOne({
//         market: marke._id,
//         name,
//         category: departmen._id,
//       })

//       if (producttype) {
//         return res.status(400).json({
//           message: `Diqqat! ${name} xizmat turi avval yaratilgan.`,
//         })
//       }

//       const newProductType = new ProductType({
//         name,
//         category: departmen._id,
//         market: marke._id,
//       })
//       await newProductType.save()

//       const updateCategory = await Category.findByIdAndUpdate(departmen._id, {
//         $push: {
//           producttypes: newProductType._id,
//         },
//       })
//       all.push(newProductType)
//     }

//     res.send(all)
//   } catch (error) {
//     res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
//   }
// }

//ProductType register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateProductType(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { name, category, market } = req.body;

    const product = await ProductType.findOne({
      market,
      name,
      category,
    });

    if (product) {
      return res.status(400).json({
        message: `Diqqat! ${name} xizmat turi avval yaratilgan.`,
      });
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const categor = await Category.findById(category);

    if (!categor) {
      return res.status(400).json({
        message: "Diqqat! Kategoriya ma'lumotlari topilmadi.",
      });
    }

    const newProductType = new ProductType({
      name,
      category,
      market,
    });
    await newProductType.save();

    const producttype = await ProductType.findById(newProductType._id)
      .select("name category")
      .populate("category", "code");

    await Category.findByIdAndUpdate(category, {
      $push: {
        producttypes: newProductType._id,
      },
    });

    res.send(producttype);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductType update
module.exports.update = async (req, res) => {
  try {
    const { _id, name, category, market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const categor = await Category.findById(category);

    if (!categor) {
      return res.status(400).json({
        message: "Diqqat! Kategoriya ma'lumotlari topilmadi.",
      });
    }

    const product = await ProductType.findById(_id);

    if (!product) {
      return res.status(400).json({
        message: `Diqqat! ${name} mahsulot turi avval yaratilmagan.`,
      });
    }

    await Category.findByIdAndUpdate(product.category, {
      $pull: {
        producttypes: _id,
      },
    });

    await Category.findByIdAndUpdate(category, {
      $push: {
        producttypes: _id,
      },
    });

    product.name = name;
    product.category = category;
    await product.save();

    for (const produc of product.products) {
      await Product.findByIdAndUpdate(produc, {
        category: category,
      });
    }

    const updatedproduct = await ProductType.findById(_id)
      .select("name category")
      .populate("category", "code");

    res.send(updatedproduct);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductType delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, category, market, name } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const categor = await Category.findById(category);

    if (!categor) {
      return res.status(400).json({
        message: "Diqqat! Kategoriya ma'lumotlari topilmadi.",
      });
    }

    const productType = await ProductType.findById(_id);

    if (!productType) {
      return res.status(400).json({
        message: `Diqqat! ${name} xizmat turi avval yaratilmagan.`,
      });
    }

    if (productType.products.length > 0) {
      return res.status(400).json({
        message: `Diqqat! ${name} mahsulot turiga tegishli mahsulotlar mavjudligi sababli uni o'chirishning imkoni mavjud emas.`,
      });
    }

    await Category.findByIdAndUpdate(category, {
      $pull: {
        producttypes: _id,
      },
    });

    await ProductType.findByIdAndDelete(_id);

    productType.products.map(async (s) => {
      const id = new ObjectId(s).toString();
      let ss = await Product.findById(id);
      if (ss.producttype) {
        ss.producttype = null;
      }

      await ss.save();
    });
    res.send(productType);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//ProductType getall
module.exports.getAll = async (req, res) => {
  try {
    const { market, currentPage, countPage } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
    }

    const producttypesCount = await ProductType.find({ market }).count();
    const producttypes = await ProductType.find({ market })
      .sort({ _id: -1 })
      .select("name market category")
      .populate("category", "code")
      .skip(currentPage * countPage)
      .limit(countPage);
    res.status(201).json({ producttypes, count: producttypesCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getProductType = async (req, res) => {
  try {
    const { market, currentPage, countPage, search } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const categorycode = new RegExp(".*" + search.categorycode + ".*", "i");
    const name = new RegExp(".*" + search.name + ".*", "i");

    const producttypes = await ProductType.find({ name: name, market })
      .sort({ _id: -1 })
      .select("name category market")
      .populate({ path: "category", match: { code: categorycode } });

    const filter = producttypes.filter((producttype) => {
      return producttype.category !== null;
    });

    res.status(201).json({
      count: filter.length,
      producttypes: filter.splice(currentPage * countPage, countPage),
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getProductTypeExcel = async (req, res) => {
  try {
    const { market, search } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const categorycode = new RegExp(".*" + search.categorycode + ".*", "i");
    const name = new RegExp(".*" + search.name + ".*", "i");

    const producttypes = await ProductType.find({ name: name, market })
      .sort({ _id: -1 })
      .select("name category market")
      .populate({ path: "category", match: { code: categorycode } });

    const filter = producttypes.filter((producttype) => {
      return producttype.category !== null;
    });

    res.status(201).json(filter);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getProductTypeIncoming = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
    }
    const producttypes = await ProductType.find({ market })
      .sort({ _id: -1 })
      .select("name market category");
    res.status(201).json(producttypes);
  } catch (error) {}
};
