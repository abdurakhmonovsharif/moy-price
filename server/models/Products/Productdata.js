const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const productdata = new Schema(
  {
    name: { type: String, required: true },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    code: { type: String, required: true },
    barcode: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateProductData(productdata) {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string(),
    code: Joi.string().required(),
    category: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(productdata);
}

module.exports.validateProductData = validateProductData;
module.exports.ProductData = model("ProductData", productdata);
