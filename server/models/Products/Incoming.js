const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const incoming = new Schema(
  {
    totalprice: { type: Number, required: true },
    unitprice: { type: Number, required: true },
    totalpriceuzs: { type: Number, required: true },
    unitpriceuzs: { type: Number, required: true },
    pieces: { type: Number, required: true },
    file: { type: String },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    incomingconnector: {
      type: Schema.Types.ObjectId,
      ref: 'IncomingConnector',
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    producttype: {
      type: Schema.Types.ObjectId,
      ref: 'ProductType',
    },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateIncoming(incoming) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    unitprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    unitpriceuzs: Joi.number().required(),
    pieces: Joi.number().required(),
    product: Joi.string().required(),
    category: Joi.string(),
    producttype: Joi.string(),
    incomingconnector: Joi.string(),
    unit: Joi.string().required(),
    supplier: Joi.string().required(),
    user: Joi.string().required(),
    file: Joi.string(),
    market: Joi.string().required(),
  });
  return schema.validate(incoming);
}

function validateIncomingAll(incoming) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    unitprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    unitpriceuzs: Joi.number().required(),
    product: Joi.object().required(),
    category: Joi.object(),
    producttype: Joi.object(),
    brand: Joi.any(),
    unit: Joi.object().required(),
    supplier: Joi.object().required(),
    user: Joi.string().required(),
    pieces: Joi.number().required(),
    file: Joi.string(),
    sellingprice: Joi.number(),
    sellingpriceuzs: Joi.number(),
    tradeprice: Joi.number(),
    tradepriceuzs: Joi.number(),
  });
  return schema.validate(incoming);
}

module.exports.validateIncoming = validateIncoming;
module.exports.validateIncomingAll = validateIncomingAll;
module.exports.Incoming = model('Incoming', incoming);
