const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const payment = new Schema(
  {
    totalprice: { type: Number },
    totalpriceuzs: { type: Number },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    payment: { type: Number, required: true },
    paymentuzs: { type: Number, required: true },
    cash: { type: Number, required: true },
    cashuzs: { type: Number, required: true },
    card: { type: Number, required: true },
    carduzs: { type: Number, required: true },
    transfer: { type: Number, required: true },
    transferuzs: { type: Number, required: true },
    type: { type: String, required: true },
    comment: { type: String },
    saleconnector: {
      type: Schema.Types.ObjectId,
      ref: 'SaleConnector',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validatePayment(payment) {
  const schema = Joi.object({
    totalprice: Joi.number(),
    totalpriceuzs: Joi.number(),
    products: Joi.array().required(),
    payment: Joi.number(),
    paymentuzs: Joi.number(),
    card: Joi.number(),
    carduzs: Joi.number(),
    cash: Joi.number(),
    cashuzs: Joi.number(),
    transfer: Joi.number(),
    transferuzs: Joi.number(),
    type: Joi.string(),
    comment: Joi.string(),
    saleconnector: Joi.string(),
    user: Joi.string().required(),
    market: Joi.string().required(),
  });
  return schema.validate(payment);
}

module.exports.validatePayment = validatePayment;
module.exports.Payment = model('Payment', payment);
