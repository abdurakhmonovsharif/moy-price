const {
  Product,
  validateProduct,
  validateProductExcel,
} = require("../../models/Products/Product");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Category } = require("../../models/Products/Category");
const { ProductType } = require("../../models/Products/ProductType");
const { Unit } = require("../../models/Products/Unit");
const { Brand } = require("../../models/Products/Brand");
const { ProductPrice } = require("../../models/Products/ProductPrice");
const {
  FilialProduct,
  validateFilialProduct,
} = require("../../models/FilialProducts/FilialProduct");
const { ProductData } = require("../../models/Products/Productdata");
const ObjectId = require("mongodb").ObjectId;
const {
  Exchangerate,
  validateExchangerate,
} = require("../../models/Exchangerate/Exchangerate");
const { SaleProduct } = require("../../models/Sales/SaleProduct");

const filter = require("lodash").filter;

//Product registerall
module.exports.registerAll = async (req, res) => {
  try {
    const products = req.body.products;
    const market = req.body.market;
    const { currentPage, countPage, search } = req.body;

    const all = [];

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }
    for (const product of products) {
      const category = await Category.findOne({
        market,
        code: product.category,
      });

      const productData = await ProductData.findOne({
        barcode: product.barcode,
        market,
        code: product.code,
        category: category && category._id,
      });

      if (productData) {
        return res.status(400).json({
          message: `Diqqat! ${product.category} kategoriyasida ${product.code} kodli mahsulot avval yaratilgan.`,
        });
      }
    }

    for (const product of products) {
      const { error } = validateProductExcel(product);
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
      const {
        barcode,
        category,
        name,
        code,
        unit,
        incomingprice,
        sellingprice,
        incomingpriceuzs,
        sellingpriceuzs,
        total,
        tradeprice,
        tradepriceuzs,
        minimumcount,
      } = product;

      let categor = await Category.findOne({
        code: category,
        market,
      });

      if (!categor) {
        const newcategory = new Category({
          code: category,
          market,
        });
        await newcategory.save();
        categor = newcategory;
      }

      const newProductData = new ProductData({
        barcode: barcode
          ? barcode
          : "47800" + categor.code.toString() + code.toString(),
        code,
        name,
        category: categor._id,
        market,
      });
      await newProductData.save();

      const newProduct = new Product({
        productdata: newProductData._id,
        category: categor._id,
        market,
        unit,
        total: Math.round(total * 1000) / 1000,
        minimumcount: minimumcount ? minimumcount : 0,
      });

      // Create Price
      const newPrice = new ProductPrice({
        incomingprice: incomingprice
          ? Math.round(incomingprice * 1000) / 1000
          : 0,
        sellingprice: sellingprice ? Math.round(sellingprice * 1000) / 1000 : 0,
        incomingpriceuzs: incomingpriceuzs
          ? Math.round(incomingpriceuzs * 1) / 1
          : 0,
        sellingpriceuzs: sellingpriceuzs
          ? Math.round(sellingpriceuzs * 1) / 1
          : 0,
        tradeprice: tradeprice ? Math.round(tradeprice * 1000) / 1000 : 0,
        tradepriceuzs: tradepriceuzs ? Math.round(tradepriceuzs * 1) / 1 : 0,
        market,
      });
      await newPrice.save();
      newProduct.price = newPrice._id;

      // Create unit
      const uni = await Unit.findOne({
        name: unit,
        market,
      });

      if (uni) {
        newProduct.unit = uni._id;
      } else {
        const newUnit = new Unit({
          name: unit,
          market,
        });
        await newUnit.save();
        newProduct.unit = newUnit._id;
      }

      all.push(newProduct);
    }

    for (const product of all) {
      await product.save();

      await ProductData.findByIdAndUpdate(product.productdata, {
        unit: product.unit,
        $push: {
          products: product._id,
        },
        product: product._id,
      });

      await Category.findByIdAndUpdate(product.category, {
        $push: {
          products: product._id,
        },
      });

      await ProductPrice.findByIdAndUpdate(product.price, {
        product: product._id,
      });
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

    const allproducts = await Product.find({
      market,
    })
      .sort({ code: 1 })
      .select("total market category minimumcount")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    let filtered = filter(
      allproducts,
      (product) => product.productdata !== null && product.category !== null
    );

    const count = filtered.length;
    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product register
module.exports.register = async (req, res) => {
  try {
    const { currentPage, countPage, search } = req.body;
    const { error } = validateProduct(req.body.product);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
    const {
      barcode,
      category,
      name,
      code,
      market,
      unit,
      total,
      incomingprice,
      sellingprice,
      incomingpriceuzs,
      sellingpriceuzs,
      tradeprice,
      tradepriceuzs,
      minimumcount,
      width
    } = req.body.product;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    let categor = await Category.findById(category);

    const product = await ProductData.findOne({
      market,
      category,
      code,
    });

    const productBarcode = await ProductData.findOne({
      barcode,
      market,
    });

    if (product) {
      return res.status(400).json({
        message: `Diqqat! ${code} kodli mahsulot avval yaratilgan.`,
      });
    }

    if (productBarcode) {
      return res.status(400).json({
        message: `Diqqat! ${barcode} shtrixkodli mahsulot avval yaratilgan.`,
      });
    }

    if (!categor) {
      return res.status(400).json({
        message: `Diqqat! Kategoriya ma'lumotlari topilmadi.`,
      });
    }

    const unitt = await Unit.findById(unit);

    if (!unitt) {
      return res.status(400).json({
        message: `Diqqat! Ko'rsatilgan o'lchov birligi tizimda mavjud emas.`,
      });
    }

    const newProductData = new ProductData({
      code,
      name,
      category,
      unit,
      market,
      barcode,
    });
    await newProductData.save();

    const newProduct = new Product({
      productdata: newProductData._id,
      category,
      market,
      unit,
      width,
      minimumcount,
      total: Math.round(total * 100) / 100,
    });

    const newPrice = new ProductPrice({
      incomingprice: incomingprice
        ? Math.round(incomingprice * 1000) / 1000
        : 0,
      sellingprice: sellingprice ? Math.round(sellingprice * 1000) / 1000 : 0,
      incomingpriceuzs: incomingpriceuzs
        ? Math.round(incomingpriceuzs * 1) / 1
        : 0,
      sellingpriceuzs: sellingpriceuzs
        ? Math.round(sellingpriceuzs * 1) / 1
        : 0,
      tradeprice: tradeprice ? Math.round(tradeprice * 1000) / 1000 : 0,
      tradepriceuzs: tradepriceuzs ? Math.round(tradepriceuzs * 1) / 1 : 0,
      market,
    });

    await newPrice.save();

    newProduct.price = newPrice._id;
    await newProduct.save();
    newPrice.product = newProduct._id;
    await newPrice.save();

    await ProductData.findByIdAndUpdate(newProductData._id, {
      $push: {
        products: newProduct._id,
      },
      product: newProduct._id,
    });

    await Category.findByIdAndUpdate(category, {
      $push: {
        products: newProductData._id,
      },
    });


    if (!marke.mainmarket) {
      for (const filialId of marke.filials) {
        const filialCategory = await Category.findOne({
          market: filialId,
          code: categor.code
        })

        const filialproduct = await ProductData.findOne({
          market: filialId,
          category: filialCategory._id,
          code, 
        });

        const filialproductBarcode = await ProductData.findOne({
          barcode,
          market: filialId,
        });

        if (filialproduct) {
          return res.status(400).json({
            message: `Diqqat! ${code} kodli mahsulot avval yaratilgan.`,
          });
        }

        if (filialproductBarcode) {
          return res.status(400).json({
            message: `Diqqat! ${barcode} shtrixkodli mahsulot avval yaratilgan.`,
          });
        }

        if (!filialCategory) {
          return res.status(400).json({
            message: `Diqqat! Kategoriya ma'lumotlari topilmadi.`,
          });
        }

        const isfilialunitt = await Unit.findOne({
          market: filialId,
          name: unitt.name
        })

        let filialunitt = null;

        if (!isfilialunitt) {
          // return res.status(400).json({
          //   message: `Diqqat! Ko'rsatilgan o'lchov birligi omborda mavjud emas.`,
          // });
          filialunitt = new Unit({
            name: unitt.name,
            market: filialId
          })
          await filialunitt.save()
        } else {
           filialunitt = isfilialunitt
        }
        console.log(filialunitt);

        const newFilialProductData = new ProductData({
          code,
          name,
          category: filialCategory._id,
          unit: filialunitt._id,
          market: filialId,
          barcode,
        });
        await newFilialProductData.save();

        const newFilialProduct = new Product({
          productdata: newFilialProductData._id,
          category: filialCategory._id,
          market: filialId,
          unit: filialunitt,
          minimumcount,
          total: 0,
        });

        const newFilialPrice = new ProductPrice({
          incomingprice: incomingprice
            ? Math.round(incomingprice * 1000) / 1000
            : 0,
          sellingprice: sellingprice ? Math.round(sellingprice * 1000) / 1000 : 0,
          incomingpriceuzs: incomingpriceuzs
            ? Math.round(incomingpriceuzs * 1) / 1
            : 0,
          sellingpriceuzs: sellingpriceuzs
            ? Math.round(sellingpriceuzs * 1) / 1
            : 0,
          tradeprice: tradeprice ? Math.round(tradeprice * 1000) / 1000 : 0,
          tradepriceuzs: tradepriceuzs ? Math.round(tradepriceuzs * 1) / 1 : 0,
          market: filialId,
        });

        await newFilialPrice.save();

        newFilialProduct.price = newFilialPrice._id;
        await newFilialProduct.save();
        newFilialPrice.product = newFilialProduct._id;
        await newFilialPrice.save();

        await ProductData.findByIdAndUpdate(newFilialProductData._id, {
          $push: {
            products: newFilialProduct._id,
          },
          product: newFilialProduct._id,
        });

        await Category.findByIdAndUpdate(filialCategory, {
          $push: {
            products: newFilialProductData._id,
          },
        });
      }
    }


    const productcode = new RegExp(
      ".*" + search ? search.code : "" + ".*",
      "i"
    );

    const productcategory = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );

    const productname = new RegExp(
      ".*" + search ? search.name : "" + ".*",
      "i"
    );

    const products = await Product.find({
      market,
    })
      .sort({ code: -1 })
      .select("total market category minimumcount width")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    let filtered = filter(
      products,
      (product) => product.productdata !== null && product.category !== null
    );

    const count = filtered.length;
    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product update
module.exports.update = async (req, res) => {
  try {
    const {
      _id,
      name,
      code,
      category,
      market,
      unit,
      priceid,
      incomingprice,
      sellingprice,
      incomingpriceuzs,
      sellingpriceuzs,
      tradeprice,
      tradepriceuzs,
      total,
      productdata,
      barcode,
      minimumcount,
      width
    } = req.body.product;

    const { currentPage, countPage, search } = req.body;
    const marke = await Market.findById(market);
    
    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const product = await Product.findById(_id)
      .populate({
        path: "productdata",
        select: "code barcode",
      })
      .populate({
        path: "category",
        select: "code",
      });

    if (!product) {
      return res.status(400).json({
        message: `Diqqat! ${code} kodli mahsulot avval yaratilmagan.`,
      });
    }

    if (product.category._id.toString() !== category) {
      const check = await ProductData.findOne({ category, code, market });
      if (check) {
        return res.status(400).json({
          message: `Diqqat! ${code} kodli mahsulot avval yaratilgan.`,
        });
      }
    }

    if (
      product.category._id.toString() === category &&
      code !== product.productdata.code
    ) {
      const check = await ProductData.findOne({ category, code, market });
      if (check) {
        return res.status(400).json({
          message: `Diqqat! ${code} kodli mahsulot avval yaratilgan.`,
        });
      }
    }

    const barCode = await ProductData.findOne({ barcode, market });
    if (barCode && product.productdata.barcode !== barCode.barcode) {
      return res.status(400).json({
        message: `Diqqat! ${barcode} shtrix kodli mahsulot avval yaratilgan.`,
      });
    }

    const exchangerate = await Exchangerate.findOne({ market })
      .select("exchangerate")
      .sort({ _id: -1 });

    await ProductPrice.findByIdAndUpdate(priceid, {
      incomingprice: Math.round(incomingprice * 1000) / 1000,
      sellingprice: Math.round(sellingprice * 1000) / 1000,
      incomingpriceuzs:
        Math.round(
          (incomingpriceuzs
            ? incomingpriceuzs
            : exchangerate.exchangerate * incomingprice) * 1
        ) / 1,
      sellingpriceuzs:
        Math.round(
          (sellingpriceuzs
            ? sellingpriceuzs
            : exchangerate.exchangerate * sellingprice) * 1
        ) / 1,
      tradeprice: Math.round(tradeprice * 1000) / 1000,
      tradepriceuzs: Math.round(tradepriceuzs * 1) / 1,
    });
    product.unit = unit;
    product.total = total;
    product.width = width;
    const productData = await ProductData.findById(productdata);

    let oldCode = productData.code

    productData.name = name;
    productData.code = code;
    productData.barcode = barcode;
    if (category !== productData.category) {
      await Category.findByIdAndUpdate(productData.category, {
        $pull: {
          products: new ObjectId(productData._id),
        },
      });

      updateCategory = await Category.findByIdAndUpdate(category, {
        $push: {
          products: productData._id,
        },
      });
      product.category = updateCategory._id;
      productData.category = updateCategory._id;
    }
    product.minimumcount = minimumcount;
    await product.save();
    await productData.save();

    const categoryData = await Category.findById(category)
    const unitt = await Unit.findById(unit)

    if (!marke.mainmarket) {
      for (const filialId of marke.filials) {
        console.log(filialId);
        const filialCategory = await Category.findOne({
          market: filialId,
          code: categoryData.code
        })

        const filialproductData = await ProductData.findOne({
          market: filialId,
          code: oldCode,
          category: filialCategory
        });

        console.log(filialproductData);

        const filialproduct = await Product.findOne({
          productdata: filialproductData && filialproductData._id,
          market: filialId
        })
          .populate({
            path: "productdata",
            select: "code barcode",
          })
          .populate({
            path: "category",
            select: "code",
          });

        if (filialCategory && filialproductData && filialproduct) {
          await ProductPrice.findByIdAndUpdate(filialproduct.price, {
            incomingprice: Math.round(incomingprice * 1000) / 1000,
            sellingprice: Math.round(sellingprice * 1000) / 1000,
            incomingpriceuzs:
              Math.round(
                (incomingpriceuzs
                  ? incomingpriceuzs
                  : exchangerate.exchangerate * incomingprice) * 1
              ) / 1,
            sellingpriceuzs:
              Math.round(
                (sellingpriceuzs
                  ? sellingpriceuzs
                  : exchangerate.exchangerate * sellingprice) * 1
              ) / 1,
            tradeprice: Math.round(tradeprice * 1000) / 1000,
            tradepriceuzs: Math.round(tradepriceuzs * 1) / 1,
          });
  
          const filialunitt = await Unit.findOne({
            market: filialId,
            name: unitt.name
          })
  
          if (!filialunitt) {
            // return res.status(400).json({
            //   message: `Diqqat! Ko'rsatilgan o'lchov birligi omborda mavjud emas.`,
            // });
            const newFilialUnit = new Unit({
              name: unitt.name,
              market: filialId
            })
            await newFilialUnit.save()
  
            filialproduct.unit = newFilialUnit._id;
          }
  
          filialproduct.unit = filialunitt;
          // product.total = total;
  
  
          filialproductData.name = name;
          filialproductData.code = code;
          filialproductData.barcode = barcode;
          if (filialCategory !== filialproductData.category) {
            await Category.findByIdAndUpdate(filialproductData.category, {
              $pull: {
                products: new ObjectId(filialproductData._id),
              },
            });
  
            updateCategory = await Category.findByIdAndUpdate(filialproductData.category, {
              $push: {
                products: filialproductData._id,
              },
            });
            filialproduct.category = updateCategory._id;
            productData.category = updateCategory._id;
          }
          filialproduct.minimumcount = minimumcount;
          await filialproduct.save();
          await filialproductData.save();
        }
      }
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
    })
      .sort({ code: 1 })
      .select("total market category minimumcount width")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "code name",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    let filtered = filter(
      products,
      (product) => product.productdata !== null && product.category !== null
    );

    const count = filtered.length;
    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product delete
module.exports.delete = async (req, res) => {
  try {
    const {
      _id,
      category,
      market,
      name,
      productdata,
      search,
      currentPage,
      countPage,
    } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const produc = await Product.findById(_id);
    produc.isArchive = true;
    await produc.save()

    // const categor = await Category.findById(category);

    // if (!categor) {
    //   return res.status(400).json({
    //     message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
    //   });
    // }

    // const tovar = await Product.findById(_id);

    // if (tovar.total > 0) {
    //   return res.status(400).json({
    //     message:
    //       "Diqqat! Mahsulot omborda mavjudligi sababli ushbu mahsulotni o'chirishni imkoni mavjud emas.",
    //   });
    // }

    // const code = await ProductData.findById(productdata)

    // if (!marke.mainmarket) {
    //   for (const filialId of marke.filials) {
    //     const filialproductdata = await ProductData.findOne({
    //       market: filialId,
    //       code: code.code,
    //     })

    //     const filialproduct = await Product.findOne({
    //       market: filialId,
    //       productdata: filialproductdata._id,
    //     })

    //     if (filialproduct.total > 0) {
    //       return res.status(400).json({
    //         message: "Diqqat! Boshqa omborlarda maxsulot mavjud!",
    //       });
    //     } else {
    //       await Product.findByIdAndDelete(filialproduct._id);
    //       await ProductData.findByIdAndDelete(filialproductdata._id);
    //     }

    //   }
    //   const product = await Product.findByIdAndDelete(_id);

    //   if (!product) {
    //     return res.status(400).json({
    //       message: `Diqqat! ${name} mahsuloti avval yaratilmagan.`,
    //     });
    //   }
      
    //   await ProductData.findByIdAndDelete(productdata);
    // } else {
    //   const product = await Product.findById(_id);

    //   if (!product) {
    //     return res.status(400).json({
    //       message: `Diqqat! ${name} mahsuloti avval yaratilmagan.`,
    //     });
    //   }
  
    //   await ProductData.findByIdAndDelete(productdata);
    //   await Product.findByIdAndDelete(_id);
    // }

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
      .select("total market category")
      .populate("price", "incomingprice sellingprice")
      .populate({
        path: "productdata",
        select: "name code",
        match: { name: productname, code: productcode },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: productcategory },
      })
      .populate("unit", "name");

    let filtered = filter(products, (product) => product.productdata !== null);

    const count = filtered.length;
    filtered = filtered.splice(currentPage * countPage, countPage);
    
      res.status(201).json({
        products: filtered,
        count,
      });
    
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product getall
module.exports.getAll = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const products = await Product.find({
      market,
      isArchive: false
    })
      .sort({ code: 1 })
      .select(
        "name code unit category producttype brand price total minimumcount width"
      )
      .populate("category", "name code")
      .populate("productdata", "name code barcode")
      .populate("producttype", "name")
      .populate("unit", "name")
      .populate("brand", "name")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      );

    res.send(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getProducts = async (req, res) => {
  try {
    const { market, currentPage, countPage, search, filialId } = req.body;
    const id = filialId || market;
    const marke = await Market.findById(id);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }

    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");
    const category = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );
    const barcode = new RegExp(".*" + search ? search.barcode : "" + ".*", "i");

    const products = await Product.find({
      market: id,
      isArchive: false
    })
      .sort({ code: 1 })
      .select("total market category minimumcount connections width")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: name, code: code },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: category },
      })
      .populate("unit", "name")
      .then((products) =>
        filter(
          products,
          (product) => product.productdata !== null && product.category !== null
        )
      );
    const count = products.length;
    const filtered = products.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    res.status(401).send(error);
  }
};
module.exports.getProductNotArchive=async(req,res)=>{

}
module.exports.getPartnerProducts = async (req, res) => {
  try {
    const { market, currentPage, countPage, search, partner } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }
    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");
    const category = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );
    const barcode = new RegExp(".*" + search ? search.barcode : "" + ".*", "i");

    const products = await Product.find({
      market: partner,
      connections: market,
    })
      .sort({ code: 1 })
      .select("total market category minimumcount width connections")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: name, code: code },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: category },
      })
      .populate("unit", "name")
      .then((products) =>
        filter(
          products,
          (product) => product.productdata !== null && product.category !== null
        )
      );
    const count = products.length;
    const filtered = products.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    res.status(401).send(error);
  }
};

//Product getallCategory
module.exports.getCategory = async (req, res) => {
  try {
    const { market, category } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const products = await Product.find({
      market,
      category,
    })
      .sort({ _id: -1 })
      .select("name code unit category price total")
      .populate("category", "name code")
      .populate("unit", "name")
      .populate("price", "sellingprice");

    res.send(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getAllProducttypes = async (req, res) => {
  try {
    const { market } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi." });
    }

    const producttypes = await ProductType.find({ market }).select(
      "name category market"
    );

    res.status(201).json(producttypes);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// Product getProductExcel
module.exports.getProductExcel = async (req, res) => {
  try {
    const { market, search } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malummotlari topilmadi." });
    }
    const code = new RegExp(".*" + search ? search.code : "" + ".*", "i");
    const name = new RegExp(".*" + search ? search.name : "" + ".*", "i");
    const category = new RegExp(
      ".*" + search ? search.category : "" + ".*",
      "i"
    );

    const allproducts = await Product.find({
      market,
      isArchive: false
    })
      .sort({ _id: -1 })
      .select("total unit price productdata width category minimumcount")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs tradeprice tradepriceuzs"
      )
      .populate("unit", "name")
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: name, code: code },
      })
      .populate({
        path: "category",
        select: "name code",
        match: { code: category },
      });

    const products = filter(
      allproducts,
      (product) => product.productdata !== null && product.category !== null
    );
    res.status(201).json(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product getallCategory
module.exports.getAllIncoming = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const allproducts = await Product.find({
      market,
      isArchive: false
    })
      .sort({ code: 1 })
      .select("total market category width")
      .populate(
        "price",
        "incomingprice sellingprice incomingpriceuzs sellingpriceuzs"
      )
      .populate({
        path: "productdata",
        select: "name code barcode",
      })
      .populate("unit", "name");

    const products = filter(
      allproducts,
      (product) => product.productdata !== null
    );

    res.send(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product getall by type
module.exports.getAllType = async (req, res) => {
  try {
    const { market, typeid } = req.body;
    const marke = await Market.findById(market);
    const type = await ProductType.findById(typeid);

    if (!type || !marke) {
      return res.status(400).json({
        message: "Diqqat! Ma'lumotlar topilmadi.",
      });
    }

    const products = await Product.find({
      market,
      isArchive: false,
      producttype: typeid,
    })
      .sort({ _id: -1 })
      .select("name code unit width category price total")
      .populate("category", "name code")
      .populate("unit", "name")
      .populate("price", "sellingprice");
    res.send(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product getall by brand
module.exports.getAllBrand = async (req, res) => {
  try {
    const { market, typeid } = req.body;

    const marke = await Market.findById(market);
    const bran = await Brand.findById(typeid);

    if (!bran || !marke) {
      return res.status(400).json({
        message: "Diqqat! Ma'lumotlar topilmadi.",
      });
    }

    const products = await Product.find({
      market,

      brand: typeid,
    })
      .select("name code category width producttype price unit total")
      .populate("category", "code")
      .populate("producttype", "name")
      .populate("price", "sellingprice")
      .populate("unit", "name");
    res.send(products);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product getall by category
module.exports.getAllCategory = async (req, res) => {
  try {
    const { market, categoryId, startDate, endDate } = req.body;
    const marke = await Market.findById(market);
    const categor = await Category.findById(categoryId);

    if (!categor || !marke) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const products = await Product.find({
      market,
      category: categoryId,
      isArchive: false
    })
      .sort({ code: -1 })
      .select("unit category width price total")
      .populate("productdata", "name code barcode")
      .populate("category", "name code")
      .populate("unit", "name")
      .populate(
        "price",
        "sellingprice sellingpriceuzs incomingprice incomingpriceuzs"
      )
      .lean()

    for (const product of products) {
      const saleproducts = await SaleProduct.find({
        market,
        product: product._id,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      })
        .select('pieces totalprice totalpriceuzs')
        .lean()

      product.totalsaleproducts = saleproducts.reduce((prev, el) => prev + el.pieces, 0)
      product.totalsales = saleproducts.reduce((prev, el) => prev + el.totalprice, 0)
      product.totalsalesuzs = saleproducts.reduce((prev, el) => prev + el.totalpriceuzs, 0)
    }

    const response = [...products].sort((a, b) => a.totalsaleproducts > b.totalsaleproducts ? -1 : 1)

    res.status(201).send(response);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Product deleteall
module.exports.deleteAll = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      });
    }

    const products = await Product.find({
      market,
    });

    let all = [];
    for (const product of products) {
      const del = await Product.findByIdAndDelete(product._id);

      await Category.findByIdAndUpdate(product.category, {
        $pull: {
          products: new ObjectId(product._id),
        },
      });

      await ProductType.findByIdAndUpdate(product.producttype, {
        $pull: {
          products: new ObjectId(product._id),
        },
      });

      for (const productconnector of product.productconnectors) {
        await ProductConnector.findByIdAndDelete(productconnector);
      }

      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

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
      ".*" + search ? search.productcode : "" + ".*",
      "i"
    );

    const productname = new RegExp(
      ".*" + search ? search.productname : "" + ".*",
      "i"
    );

    const products = await Product.find({
      market,
    })
      .sort({ code: 1 })
      .select("total market width category")
      .populate("price", "incomingprice sellingprice")
      .populate({
        path: "productdata",
        select: "name code barcode",
        match: { name: productname, code: productcode },
      })
      .populate("unit", "name");

    let filtered = filter(products, (product) => product.productdata !== null);

    const count = filtered.length;

    filtered = filtered.splice(currentPage * countPage, countPage);
    res.status(201).json({
      products: filtered,
      count,
    });
  } catch (error) {
    res.status(401).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getproductsale = async (req, res) => {
  try {
    const { market } = req.body;

    const marke = await Market.findById(market);
    if (!marke) {
      return res
        .status(401)
        .json({ message: "Diqqat! Do'kon malumotlari topilmadi" });
    }

    const products = await Product.find({
      market,
    })
      .sort({ timestamp: -1 })
      .select("market total width")
      .populate("productdata", "name code barcode")
      .populate(
        "price",
        "sellingprice incomingprice sellingpriceuzs incomingpriceuzs"
      )
      .populate("category", "name code")
      .populate("unit", "name");

    res.status(201).json(products);
  } catch (error) {
    res.status(401).json({ message: "Serverda xatolik yuz berdi..." });
  }
};

//Product register
module.exports.updateAllProducts = async (req, res) => {
  try {
    let allproducts = await Product.find({});
    allproducts.map(async (product) => {
      if (product.code) {
        const productData = new ProductData({
          market: product.market,
          name: product.name,
          code: product.code,
          category: product.category,
          unit: product.unit,
        });

        await productData.save();

        await ProductData.findByIdAndUpdate(productData._id, {
          $push: {
            products: new ObjectId(product._id),
          },
          product: new ObjectId(product._id),
        });

        await Product.findByIdAndUpdate(product._id, {
          productdata: productData._id,
          $unset: { name: true, code: true },
        });

        await Category.findByIdAndUpdate(product.category, {
          $push: {
            products: new ObjectId(productData._id),
          },
        });

        await Category.findByIdAndUpdate(product.category, {
          $pull: {
            products: new ObjectId(product._id),
          },
        });
      }
    });

    res.status(201).json({
      message: "tayyor",
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.productcode = async (req, res) => {
  try {
    const { market, categoryId } = req.body;
    const code = await ProductData.find({
      market,
      category: categoryId,
    }).count();

    res.status(201).send({ code: 1001 + code });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
