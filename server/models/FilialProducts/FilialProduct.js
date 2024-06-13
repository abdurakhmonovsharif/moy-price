const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const filialproduct = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "FilialProduct" },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    price: { type: Schema.Types.ObjectId, ref: "FilialProductPrice" },
    total: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    producttype: { type: Schema.Types.ObjectId, ref: "FilialProductType" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateFilialProduct(filialproduct) {
  const schema = Joi.object({
    product: Joi.string().required(),
    unit: Joi.string(),
    price: Joi.number(),
    total: Joi.number(),
    category: Joi.string(),
    producttype: Joi.string(),
    brand: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(filialproduct);
}

module.exports.validateFilialProduct = validateFilialProduct;
module.exports.FilialProduct = model("FilialProduct", filialproduct);
