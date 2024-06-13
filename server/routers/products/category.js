const {
  Category,
  validateCategory,
} = require("../../models/Products/Category");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Product } = require("../../models/Products/Product");
const { ProductType } = require("../../models/Products/ProductType");
const { SaleProduct } = require("../../models/Sales/SaleProduct");
require("../../models/Products/ProductPrice");

//Category register
module.exports.registerAll = async (req, res) => {
  try {
    const categorys = req.body;
    const all = [];
    for (const d of categorys) {
      const { error } = validateCategory(d);
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      const { name, probirka, market } = d;

      const marke = await Market.findOne({ name: market });

      if (!marke) {
        return res.status(400).json({
          message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
        });
      }

      const category = await Category.findOne({
        market: marke._id,
        name,
      });

      if (category) {
        return res.status(400).json({
          message: `Diqqat! ${name} kategoriyai avval yaratilgan.`,
        });
      }

      const newCategory = new Category({
        name,
        probirka,
        market: marke._id,
      });
      await newCategory.save();
      all.push(newCategory);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Category register
module.exports.register = async (req, res) => {
  try {
    const { category, market, search, currentPage, countPage } = req.body;
    const name = category.name;
    const code = category.code;
    const { error } = validateCategory({ name, code, market });
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const categor = await Category.findOne({
      market,
      code,
      name,
    });
    if (categor) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kategoriya avval yaratilgan.",
      });
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const newCategory = new Category({
      name,
      market,
      code,
    });
    await newCategory.save();

    const categorycode = new RegExp(
      ".*" + (search ? search.code : "") + ".*",
      "i"
    );
    // const categoryname = new RegExp(
    //   ".*" + (search ? search.name : "") + ".*",
    //   "i"
    // );

    const categoryCount = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    }).count();

    const categorys = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    })
      .sort({ code: 1 })
      .select("code market name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ categories: categorys, count: categoryCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Category update
module.exports.update = async (req, res) => {
  try {
    const { market, category, search, currentPage, countPage } = req.body;

    const { name, code, _id } = category;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const old = await Category.findOne({
      market,
      code,
    });

    if (old && old._id.toString() !== _id) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kategoriya avval yaratilgan.",
      });
    }

    const categor = await Category.findById(_id);

    if (!categor) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kategoriya topilmadi.",
      });
    }

    categor.name = name;
    categor.code = code;
    await categor.save();

    const categorycode = new RegExp(
      ".*" + (search ? search.code : "") + ".*",
      "i"
    );
    // const categoryname = new RegExp(
    //   ".*" + (search ? search.name : "") + ".*",
    //   "i"
    // );

    const categoryCount = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    }).count();

    const categorys = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    })
      .sort({ code: 1 })
      .select("code market name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ categories: categorys, count: categoryCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Category getAll
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon ma'lumotlari topilmadi." });
    }

    const categories = await Category.find({ market }).select(
      "code market name products"
    );
    res.status(201).json(categories);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Category getaCategories
module.exports.getCategories = async (req, res) => {
  try {
    const { market, currentPage, countPage, search, startDate, endDate } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const code = new RegExp(".*" + (search ? search.code : "") + ".*", "i");
    // const name =  new RegExp(".*" + (search ? search.name : "") + ".*", "i");

    const categoryCount = await Category.find({
      market,
      code,
      // name,
    }).count();

    const categorys = await Category.find({
      market,
      code,
      // name,
    })
      .sort({ code: 1 })
      .select("code market name")
      .skip(currentPage * countPage)
      .limit(countPage)
      .lean()

      for (const category of categorys) {
        
        const products = await SaleProduct.find({
          market,
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        })
          .sort({ _id: -1 })
          .select('-__v -updatedAt -isArchive')
          .populate({
            path: "product",
            select: "category price",
            match: {category: category}
          })
          .populate({
            path: "price",
            select: "incomingprice incomingpriceuzs",
          })
          .lean()
          .then(products => products.filter(product => product.product));
          
          category.totalproducts = products.reduce((prev, product) => prev + product.pieces, 0) 
          category.totalsales = products.reduce((prev, product) => prev + product.totalprice, 0) 
          category.totalsalesuzs = products.reduce((prev, product) => prev + product.totalpriceuzs, 0) 
          const income = products.reduce((prev, product) => prev + ((product.price.incomingprice || 0) * product.pieces), 0)
          const incomeuzs = products.reduce((prev, product) => prev + ((product.price.incomingpriceuzs || 0) * product.pieces), 0)
          category.profit = products.reduce((prev, product) => prev + product.totalprice, 0) - income
          category.profituzs = products.reduce((prev, product) => prev + product.totalpriceuzs, 0) - incomeuzs
      }

    res.status(201).json({ categories: categorys, count: categoryCount });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Category getaCategories
module.exports.getCategoriesExcel = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    const categorys = await Category.find({
      market,
    })
      .sort({ _id: -1 })
      .select("name code market");

    res.status(201).json(categorys);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Category delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, market, search, currentPage, countPage } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const category = await Category.findById(_id);

    // if (category.producttypes && category.producttypes.length > 0) {
    //   return res.status(400).json({
    //     message:
    //       "Diqqat! Ushbu kategoriyada mahsulotlar turlari mavjud bo'lganligi sababli kategoriyani o'chirish mumkin emas.",
    //   });
    // }
    if (
      category &&
      category.products !== null &&
      category.products.length > 0
    ) {
      return res.status(400).json({
        message:
          "Diqqat! Ushbu kategoriyada mahsulotlar mavjud bo'lganligi sababli kategoriyani o'chirish mumkin emas.",
      });
    }
    await Category.findByIdAndDelete(_id);

    const categorycode = new RegExp(
      ".*" + (search ? search.code : "") + ".*",
      "i"
    );
    // const categoryname = new RegExp(
    //   ".*" + (search ? search.name : "") + ".*",
    //   "i"
    // );

    const categoryCount = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    }).count();

    const categorys = await Category.find({
      market,
      code: categorycode,
      // name: categoryname,
    })
      .sort({ code: 1 })
      .select("code market name")
      .skip(currentPage * countPage)
      .limit(countPage);

    res.status(201).json({ categories: categorys, count: categoryCount });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
