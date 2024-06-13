const Joi = require('joi');
const { Schema, model, Types } = require('mongoose');

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
    incomingconnector: {
      type: Schema.Types.ObjectId,
      ref: 'IncomingConnector',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateIncomingPayment(payment) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    payment: Joi.number().required(),
    paymentuzs: Joi.number().required(),
    card: Joi.number(),
    carduzs: Joi.number(),
    cash: Joi.number(),
    cashuzs: Joi.number(),
    transfer: Joi.number(),
    transferuzs: Joi.number(),
    type: Joi.string().default(''),
    comment: Joi.string().default(''),
  });
  return schema.validate(payment);
}

module.exports.validateIncomingPayment = validateIncomingPayment;
module.exports.IncomingPayment = model('IncomingPayment', payment);
