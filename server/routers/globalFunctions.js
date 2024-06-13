const { reduce, isElement } = require("lodash");
const { SaleConnector } = require("../models/Sales/SaleConnector");
const moment = require('moment');
const { Debt } = require("../models/Sales/Debt");
const { Market } = require("../models/MarketAndBranch/Market");
const { Client } = require("../models/Sales/Client");
const { User } = require("../models/Users");
const axios= require("axios")
const { Category, ProductData, Unit, Product, ProductPrice } =
  require("./constants").models;

const createCategory = ({ market, name, code }) => {
  const newCategory = new Category({
    market,
    name,
    code,
  });
  return newCategory.save();
};

const createProductData = ({
  market,
  name,
  code,
  category,
  product,
  unit,
  barcode,
}) => {
  const newProductData = new ProductData({
    market,
    name,
    code,
    category,
    product,
    unit,
    barcode,
  });
  return newProductData.save();
};

const createUnit = ({ market, name }) => {
  const newUnit = new Unit({
    market,
    name,
  });
  return newUnit.save();
};

const createProduct = ({
  market,
  category,
  productdata,
  unit,
  price,
  minimumcount,
  total,
}) => {
  const newProduct = new Product({
    market,
    category,
    productdata,
    unit,
    price,
    minimumcount,
    total,
  });
  return newProduct.save();
};

const createProductPrice = ({
  market,
  product,
  sellingprice,
  sellingpriceuzs,
  incomingprice,
  incomingpriceuzs,
  tradeprice,
  tradepriceuzs,
}) => {
  const newProductPrice = new ProductPrice({
    market,
    product,
    sellingprice,
    sellingpriceuzs,
    incomingprice,
    incomingpriceuzs,
    tradeprice,
    tradepriceuzs,
  });
  return newProductPrice.save();
};

const sendMessage = async () => {
  console.log('Messaging has started!');

  const formatMessage = (
    name,
    debt,
    pay_end_date,
    market_number,
    market_name,
    isOverdue
  ) => {
    if (isOverdue) {
      return `Хурматли ${name} сиз ${market_name} дан ${debt} uzs микдорида карзингиз мавжуд. ${pay_end_date} гача эди, аммо туловингиз кечикди илтимос уз вактида туловни амалга оширинг. Мурожаат учун ${market_number}`;
    } else {
      return `Хурматли ${name} сиз ${market_name} дан ${debt} uzs микдорида карзингиз мавжуд. ${pay_end_date} гача туловни амалга оширинг. Мурожаат учун ${market_number}`;
    }
  };

  try {
    const now = moment();
    const saleConnectors = await SaleConnector.find();

    for (const el of saleConnectors) {
      for (const debtId of el.debts) {
        const debt = await Debt.findById(debtId);
        if (debt) {
          const debtEndDate = moment(debt.pay_end_date);
          const daysUntilPayment = debtEndDate.diff(now, 'days');
          console.log(daysUntilPayment);
          const isOverdue = daysUntilPayment < 0;
     
          if (debt.debt > 0 && debt.debtuzs && (isOverdue || (daysUntilPayment >= 0 && daysUntilPayment <= 3))) {
            const market = await Market.findById(el.market);
            const client = await Client.findById(el.client);
            const user = await User.findById(el.user);
            const SMS_API_KEY = market.SMS_API_KEY;

            if (SMS_API_KEY) {
              await axios.get(
                `https://smsapp.uz/new/services/send.php?key=${SMS_API_KEY}&number=${client.phoneNumber}&message=${formatMessage(
                  client.name,
                  debt.debtuzs,
                  debtEndDate.format('MM/DD/YYYY'),
                  user.phone,
                  market.name,
                  isOverdue
                )}`
              );
            }
          }
        }
      }
    }

    console.log('Messaging has ended!');
  } catch (error) {
    console.error('Failed to send message:', error.message);
  }
};
module.exports = {
  createCategory,
  createProductData,
  createUnit,
  createProduct,
  createProductPrice,
  sendMessage
};

module.exports.reducer = (arr, el) =>
  reduce(arr, (prev, item) => prev + (item[el] || 0), 0);
module.exports.reducerDuobleProperty = (arr, el1, el2) =>
  reduce(arr, (prev, item) => prev + (item[el1][el2] || 0), 0);

module.exports.roundToUzs = (number) => Math.round(number * 1) / 1;
module.exports.roundToUsd = (number) => Math.round(number * 1000) / 1000;

module.exports.regExpression = (expression) =>
  new RegExp(".*" + expression + ".*", "i");
