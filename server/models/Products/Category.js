const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const category = new Schema(
  {
    name: { type: String },
    code: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    products: [
      { type: Schema.Types.ObjectId, ref: "ProductData" },
      { type: Schema.Types.ObjectId, ref: "Product" },
    ],
    producttypes: [{ type: Schema.Types.ObjectId, ref: "ProductType" }],
    connections: [{ type: Schema.Types.ObjectId, ref: "Market" }],
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateCategory(category) {
  const schema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(category);
}

module.exports.validateCategory = validateCategory;
module.exports.Category = model("Category", category);
