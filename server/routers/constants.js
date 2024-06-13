const {
  Connection,
  validateConnection,
} = require("../models/Connections/Connection");
const { Market } = require("../models/MarketAndBranch/Market.js");
const { Product } = require("../models/Products/Product.js");
const { Unit } = require("../models/Products/Unit.js");
const { ProductData } = require("../models/Products/Productdata.js");
const { ProductPrice } = require("../models/Products/ProductPrice.js");
const { Category } = require("../models/Products/Category.js");
const { OrderConnector } = require("../models/Orders/OrderConnector.js");
const {
  OrderProduct,
  validateOrderProduct,
  validateSendingOrderProduct,
} = require("../models/Orders/OrderProduct.js");
const { TemporaryOrders } = require("../models/Orders/TemporaryOrders.js");
const {
  Exchangerate,
  validateExchangerate,
} = require("../models/Exchangerate/Exchangerate");

module.exports.models = {
  Connection,
  Market,
  Product,
  TemporaryOrders,
  ProductPrice,
  OrderConnector,
  OrderProduct,
  Category,
  ProductData,
  Unit,
  Exchangerate,
};
module.exports.validators = {
  validateConnection,
  validateOrderProduct,
  validateSendingOrderProduct,
  validateExchangerate,
};
