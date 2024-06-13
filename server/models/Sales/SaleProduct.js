const { Schema, model } = require("mongoose");
const Joi = require("joi");

// Define the saleproduct schema
const saleproductSchema = new Schema(
  {
    totalprice: { type: Number, required: true },
    totalpriceuzs: { type: Number, required: true },
    unitprice: { type: Number, required: true },
    unitpriceuzs: { type: Number, required: true },
    pieces: { type: Number, required: true },
    previous: { type: Number, required: true },
    more_parameters1: {
      type: {
        length: { type: Number, default: 0 },
        size: { type: Number, default: 0 },
        piece: { type: Number, default: 0 }
      },
      default: {}
    },
    more_parameters2: {
      type: [
        {
          col1: { type: Number, default: 0 },
          col2: { type: Number, default: 0 },
          result: { type: Number, default: 0 }
        }
      ],
      default: []
    },
    next: { type: Number, required: true },
    discount: { type: Schema.Types.ObjectId, ref: "Discount" },
    price: { type: Schema.Types.ObjectId, ref: "ProductPrice" },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    saleproducts: [{ type: Schema.Types.ObjectId, ref: "SaleProduct" }],
    saleproduct: { type: Schema.Types.ObjectId, ref: "SaleProduct" },
    saleconnector: { type: Schema.Types.ObjectId, ref: "SaleConnector" },
    fromFilial: { type: Number },
    dailysaleconnector: {
      type: Schema.Types.ObjectId,
      ref: "DailySaleConnector",
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Define the Joi validation schema
function validateSaleProduct(saleproduct) {
  const schema = Joi.object({
    totalprice: Joi.number().required(),
    totalpriceuzs: Joi.number().required(),
    unitprice: Joi.number().required(),
    unitpriceuzs: Joi.number().required(),
    pieces: Joi.number().required(),
    product: Joi.string().required(),
    market: Joi.string(),
    user: Joi.string(),
    more_parameters1: Joi.object({
      length: Joi.number().default(0),
      size: Joi.number().default(0),
      piece: Joi.number().default(0),
    }).default(),
    more_parameters2: Joi.array().items(
      Joi.object({
        col1: Joi.number().default(0),
        col2: Joi.number().default(0),
        result: Joi.number().default(0),
      })
    ).default([]),
  });
  return schema.validate(saleproduct);
}

// Export the model and validation function
module.exports.SaleProduct = model("SaleProduct", saleproductSchema);
module.exports.validateSaleProduct = validateSaleProduct;
