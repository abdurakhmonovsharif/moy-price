const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const debt = new Schema(
  {
    totalprice: { type: Number, required: true },
    totalpriceuzs: { type: Number, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    debt: { type: Number },
    debtuzs: { type: Number },
    comment: { type: String, min: 5 },
    pay_end_date:{type:Date,default:null},
    saleconnector: {
      type: Schema.Types.ObjectId,
      ref: "SaleConnector",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateDebt(debt) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    totalpricezs: Joi.number().required(),
    products: Joi.array().required(),
    debt: Joi.number(),
    debtuzs: Joi.number(),
    saleconnector: Joi.string(),
    comment: Joi.string(),
    user: Joi.string().required(),
    pay_end_date:Joi.date().required(),

    market: Joi.string().required(),
  });
  return schema.validate(debt);
}

module.exports.validateDebt = validateDebt;
module.exports.Debt = model("Debt", debt);
