const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const dailysaleconnector = new Schema(
  {
    id: { type: Number },
    comment: { type: String },
    saleconnector: { type: Schema.Types.ObjectId, ref: "SaleConnector" },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    products: [{ type: Schema.Types.ObjectId, ref: "SaleProduct" }],
    discount: { type: Schema.Types.ObjectId, ref: "Discount" },
    debt: { type: Schema.Types.ObjectId, ref: "Debt" },
    packman: { type: Schema.Types.ObjectId, ref: "Packman" },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateDailySaleConnector(dailysaleconnector) {
  const schema = Joi.object({
    id: Joi.string(),
    comment: Joi.string(),
    payments: Joi.array(),
    discounts: Joi.array(),
    debts: Joi.string(),
    packman: Joi.string(),
    client: Joi.string(),
    user: Joi.string(),
    products: Joi.array(),
    market: Joi.string(),
  });

  return schema.validate(dailysaleconnector);
}

module.exports.validateDailySaleConnector = validateDailySaleConnector;
module.exports.DailySaleConnector = model(
  "DailySaleConnector",
  dailysaleconnector
);
