const { Schema, model } = require("mongoose");
const Joi = require("joi");

const orderpayment = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
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
    accepted: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateOrderPayment(orderpayment) {
  const schema = Joi.object({
    sender: Joi.string().required(),
    market: Joi.string().required(),
    payment: Joi.number(),
    paymentuzs: Joi.number(),
    card: Joi.number(),
    carduzs: Joi.number(),
    transfer: Joi.number(),
    transferuzs: Joi.number(),
    type: Joi.string(),
    accepted: Joi.boolean(),
    comment: Joi.string(),
  });

  return schema.validate(orderpayment);
}

module.exports.validateOrderPayment = validateOrderPayment;
module.exports.OrderPayment = model("OrderPayment", orderpayment);
