const {
  User,
  validateUser,
  validateUserLogin,
  validateAdministration,
  validateSeller,
  validateEditUser,
} = require("../../models/Users");
const bcrypt = require("bcryptjs");
const { Market } = require("../../models/MarketAndBranch/Market");
const { Department } = require("../../models/Products/Category");
const config = require("config");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const { DailySaleConnector } = require("../../models/Sales/DailySaleConnector");
require("../../models/Sales/Payment");
require("../../models/Sales/SaleConnector");
require("../../models/Sales/SaleProduct");
require("../../models/Sales/Discount");
require("../../models/Sales/Client");

module.exports.register = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const {
      login,
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password,
      market,
      specialty,
      user,
      type,
    } = req.body;

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const olduser = await User.findOne({
      login,
    });

    if (olduser) {
      return res.status(400).json({
        message:
          "Diqqat! Ushbu nomdagi foydalanuvchi avval ro'yxatdan o'tkazilgan.",
      });
    }

    const hash = await bcrypt.hash(password, 8);
    const newUser = new User({
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password: hash,
      market,
      type,
      login,
      specialty,
      user,
    });
    await newUser.save();

    if (user) {
      const counteragent = await User.findByIdAndUpdate(user, {
        $push: {
          users: new ObjectId(newUser._id),
        },
      });
    }

    res
      .status(201)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli yaratildi!" });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.editUser = async (req, res) => {
  try {
    // const { error } = validateEditUser(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     error: error.message,
    //   });
    // }

    const { _id, password } = req.body;

    // const marke = await Market.findById(market);
    // if (!marke) {
    //   return res.status(400).json({
    //     message:
    //       "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
    //   });
    // }

    const hashPassword = await bcrypt.hash(password, 8);
    await User.findByIdAndUpdate(_id, {
      ...req.body,
      password: hashPassword,
    });

    const updatedUser = await User.findById(_id);

    return res.status(200).json(updatedUser);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.registerDirector = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const {
      login,
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password,
      market,
      administrator,
      qrcode
    } = req.body;
    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const olduser = await User.findOne({
      login,
    });

    if (olduser) {
      return res.status(400).json({
        message: "Diqqat! Ushbu foydalanuvchi avval ro'yxatdan o'tkazilgan.",
      });
    }

    const hash = await bcrypt.hash(password, 8);
    const newUser = new User({
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password: hash,
      market,
      type: "Director",
      login,
      administrator,
      qrcode
    });
    await newUser.save();

    await Market.findByIdAndUpdate(market, {
      director: newUser._id,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      config.get("jwtSecret"),
      { expiresIn: "12h" }
    );

    res.status(201).send({
      token,
      userId: newUser._id,
      user: newUser,
      market: newUser.market,
    });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.registerAdmin = async (req, res) => {
  try {
    const { error } = validateAdministration(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const { firstname, lastname, login, password, confirmPassword, image } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Parolni tasdiqlashda notug'ri terilgan!",
      });
    }

    const oldAdmin = await User.findOne({
      login,
    });

    if (oldAdmin) {
      return res.status(400).json({
        message:
          "Diqqat! Ushbu nomdagi administrator avval ro'yxatdan o'tkazilgan.",
      });
    }

    const hashPasword = await bcrypt.hash(password, 12);

    const newAdmin = new User({
      firstname,
      lastname,
      image,
      login,
      password: hashPasword,
      type: "Admin",
    });
    await newAdmin.save();

    res
      .status(201)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli yaratildi!" });
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

// User LOGIN
module.exports.login = async (req, res) => {
  try {
    const { error } = validateUserLogin(req.body);
    if (error) {
      return res.status(400).json({
        error: "Ma'lumot kiritishda xatolikka yo'l qo'yilgan",
        message: error.message,
      });
    }
    const { login, password } = req.body;

    const user = await User.findOne({
      login,
    }).populate("market");

    if (!user) {
      return res
        .status(400)
        .json({ message: `Login yoki parol noto'g'ri kiritilgan` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: `Login yoki parol noto'g'ri kiritilgan` });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      config.get("jwtSecret"),
      { expiresIn: "12h" }
    );

    const userr = await User.findById(user._id)
      .select("firstname type lastname image isIncomePage")
      .populate({
        path: "market",
        select: "name phone1 phone2 phone3 image permission address mainmarket director qrcode",
        populate: { 
          path: "director",
          select: "-__v -isArchive -updatedAt -password -login"
        }
      });

    const hashType = await bcrypt.hash(userr.type, 8);

    userr.type = hashType;

    res.send({
      token,
      userId: userr._id,
      user: userr,
      market: userr.market,
    });
  } catch (e) {
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Diqqat! Foydalanuvchi ID si ko'rsatilmagan",
      });
    }

    const user = await User.findById(userId).populate("market");

    if (!user) {
      return res.status(400).json({
        error:
          "Diqqat! Ushbu foydalanuvchi ma'lumotlari ro'yxatdan o'tkazilmagan.",
      });
    }

    res.status(201).send(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.getUserType = async (req, res) => {
  try {
    const { market, type } = req.body;

    if (!market) {
      return res.status(400).json({
        error: "Diqqat! Market ma'lumotlari topilmadi.",
      });
    }

    const users = await User.find({
      market,
      type,
    });

    res.status(201).send(users);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const { market } = req.body;

    const users = await User.find({
      market,
      isArchive: false,
    })
      .populate("specialty", "name")
      .select("-password -isArchive -createdAt -updatedAt -__v ")
      .sort({ _id: -1 });

    res.status(201).send(users);
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Diqqat! Foydalanuvchi ID si ko'rsatilmagan",
      });
    }

    const user = await User.findById(userId).populate("market");

    if (!user) {
      return res.status(400).json({
        error:
          "Diqqat! Ushbu foydalanuvchi ma'lumotlari ro'yxatdan o'tkazilmagan.",
      });
    }

    const updateUser = await User.findByIdAndUpdate(userId, {
      isArchive: true,
    });

    res
      .status(201)
      .send({ message: "Foydalanuvchi muvaffaqqiyatli o'chirildi" });
  } catch (error) {
    res.status(501).json({ error: error });
  }
};

module.exports.createseller = async (req, res) => {
  try {
    const { error } = validateSeller(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const {
      _id,
      login,
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password,
      market,
      specialty,
      isIncomePage,
      user,
    } = req.body;

    if (_id) {
      if (password) {
        const hash = await bcrypt.hash(password, 8);
        req.body.password = hash;
      }
      await User.findByIdAndUpdate(_id, req.body);

      const sellers = await User.find({ type: "Seller", market })
        .select("firstname lastname market type login phone")
        .sort({ _id: -1 });

      res.status(201).send(sellers);
    }

    const marke = await Market.findById(market);

    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const olduser = await User.findOne({
      login,
    });

    if (olduser) {
      return res.status(400).json({
        message:
          "Diqqat! Ushbu nomdagi foydalanuvchi avval ro'yxatdan o'tkazilgan.",
      });
    }

    const hash = await bcrypt.hash(password, 8);
    const newUser = new User({
      firstname,
      lastname,
      fathername,
      image,
      phone,
      password: hash,
      market,
      type: "Seller",
      login,
      specialty,
      user,
      isIncomePage
    });
    await newUser.save();

    const sellers = await User.find({ type: "Seller", market })
      .select("firstname lastname market type login phone")
      .sort({ _id: -1 });

    res.status(201).send(sellers);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getsellers = async (req, res) => {
  try {
    const { market, startDate, endDate } = req.body;
    const marke = await Market.findById(market);
    if (!marke) {
      return res.status(400).json({
        message:
          "Diqqat! Foydalanuvchi ro'yxatga olinayotgan do'kon dasturda ro'yxatga olinmagan.",
      });
    }

    const sellers = await User.find({ type: "Seller", market })
      .select("firstname lastname market type login phone isIncomePage")
      .sort({ _id: -1 })
      .lean();

    if (sellers.length > 0) {
      for (const seller of sellers) {
        const sales = await DailySaleConnector.find({
          user: seller._id,
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        })
          .select("user payment") 
          .populate(
            "payment",
            "cash cashuzs card carduzs transfer transferuzs payment paymentuzs totalprice totalpriceuzs"
          )
          .populate("saleconnector", "id")
          .populate("client", "name")
          .populate({
            path: "products",
            select: "totalprice totalpriceuzs pieces price product",
            populate: {
              path: "price",
              select:
                "incomingprice incomingpriceuzs sellingprice sellingpriceuzs",
            },
          })
          .populate({
            path: "products",
            select: "totalprice totalpriceuzs pieces price product",
            populate: {
              path: "product",
              select: "price",
              populate: {
                path: "price",
                select: "incomingprice incomingpriceuzs",
              },
            },
          })
          .populate(
            "discount",
            "discount discountuzs totalprice totalpriceuzs procient"
          );

        seller.sales = sales.length;
        seller.totalsales = sales.reduce((prev, sale) => {
          return prev + ((sale.payment && sale.payment.totalprice) || 0);
        }, 0);
        seller.totalsalesuzs = sales.reduce((prev, sale) => {
          return prev + ((sale.payment && sale.payment.totalpriceuzs) || 0);
        }, 0);

        let profit = 0;
        let profituzs = 0;

        const profitData = sales.map((sale) => {
          const totalincomingprice = sale.products.reduce(
            (prev, item) =>
              prev +
              item.pieces *
                ((item.price && item.price.incomingprice) ||
                  (item.product && item.product.price.incomingprice) ||
                  0),
            0
          );
          const totalincomingpriceuzs = sale.products.reduce(
            (prev, item) =>
              prev +
              item.pieces *
                ((item.price && item.price.incomingpriceuzs) ||
                  (item.product && item.product.price.incomingpriceuzs) ||
                  0),
            0
          );
          const totalprice = sale.products.reduce(
            (summ, product) => summ + (product.totalprice || 0),
            0
          );
          const totalpriceuzs = sale.products.reduce(
            (summ, product) => summ + (product.totalpriceuzs || 0),
            0
          );
          const discount = (sale.discount && sale.discount.discount) || 0;
          const discountuzs = (sale.discount && sale.discount.discountuzs) || 0;
          profit += totalprice - totalincomingprice - discount;
          profituzs += totalpriceuzs - totalincomingpriceuzs - discountuzs;
        });
        seller.profit = profit;
        seller.profituzs = profituzs;
      }
    }
    res.status(201).send(sellers);
  } catch (error) {
    res
      .status(501)
      .json({
        error: "Serverda xatolik yuz berdi...",
        description: error.message,
      });
  }
};
