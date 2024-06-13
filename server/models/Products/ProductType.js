const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const producttype = new Schema(
  {
    name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateProductType(producttype) {
  const schema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    market: Joi.string().required(),
  });

  return schema.validate(producttype);
}

module.exports.validateProductType = validateProductType;
module.exports.ProductType = model("ProductType", producttype);
