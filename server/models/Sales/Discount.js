const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const discount = new Schema(
  {
    totalprice: { type: Number, required: true },
    totalpriceuzs: { type: Number, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    procient: { type: Number },
    discount: { type: Number },
    discountuzs: { type: Number },
    comment: { type: String, min: 5 },
    saleconnector: {
      type: Schema.Types.ObjectId,
      ref: 'SaleConnector',
    },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateDiscount(discount) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    products: Joi.array().required(),
    discount: Joi.number(),
    discountuzs: Joi.number(),
    procient: Joi.number(),
    saleconnector: Joi.string(),
    comment: Joi.string(),
    user: Joi.string().required(),
    market: Joi.string().required(),
  });
  return schema.validate(discount);
}

module.exports.validateDiscount = validateDiscount;
module.exports.Discount = model("Discount", discount);
