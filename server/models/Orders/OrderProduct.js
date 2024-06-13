const { Schema, model } = require("mongoose");
const Joi = require("joi");

const orderproduct = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    pieces: {
      recived: { type: Number, default: 0 },
      send: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      returned: { type: Number, default: 0 },
    },
    unitprice: { type: Number, default: 0 },
    unitpriceuzs: { type: Number, default: 0 },
    totalprice: { type: Number, default: 0 },
    totalpriceuzs: { type: Number, default: 0 },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateOrderProduct(orderproduct) {
  const schema = Joi.object({
    _id: Joi.string(),
    sender: Joi.string().required(),
    product: Joi.object().required(),
    productdata: Joi.string().required(),
    category: Joi.string().required(),
    total: Joi.number().required(),
    unit: Joi.object().required(),
    pieces: Joi.object().required(),
    unitprice: Joi.number().required(),
    unitpriceuzs: Joi.number().required(),
    totalprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
  });
  return schema.validate(orderproduct);
}

function validateSendingOrderProduct(orderproduct) {
  const schema = Joi.object({
    market: Joi.string().required(),
    product: Joi.object().required(),
    productdata: Joi.string().required(),
    category: Joi.string().required(),
    total: Joi.number().required(),
    unit: Joi.object().required(),
    pieces: Joi.object().required(),
    unitprice: Joi.number().required(),
    unitpriceuzs: Joi.number().required(),
    totalprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    incomingprice: Joi.number(),
    incomingpriceuzs: Joi.number(),
  });

  return schema.validate(orderproduct);
}

module.exports = { validateOrderProduct, validateSendingOrderProduct };
module.exports.OrderProduct = model("OrderProduct", orderproduct);
