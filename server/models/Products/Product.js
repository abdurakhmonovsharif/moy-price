const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const product = new Schema(
  {
    name: { type: String },
    code: { type: Number },
    width:{type:Number,default:0},
    total: { type: Number, default: 0 },
    minimumcount: { type: Number, default: 0 },
    productdata: { type: Schema.Types.ObjectId, ref: "ProductData" },
    unit: { type: Schema.Types.ObjectId, ref: "Unit" },
    price: { type: Schema.Types.ObjectId, ref: "ProductPrice" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    producttype: { type: Schema.Types.ObjectId, ref: "ProductType" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    connections: [{ type: Schema.Types.ObjectId, ref: "Market" }],
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string(),
    width:Joi.number().default(0),
    code: Joi.number(),
    incomingprice: Joi.number(),
    sellingprice: Joi.number(),
    incomingpriceuzs: Joi.number(),
    sellingpriceuzs: Joi.number(),
    total: Joi.number(),
    minimumcount: Joi.number(),
    category: Joi.string(),
    producttype: Joi.string(),
    brand: Joi.string(),
    market: Joi.string().required(),
    barcode: Joi.string(),
    tradeprice: Joi.number(),
    tradepriceuzs: Joi.number(),
  });

  return schema.validate(product);
}

function validateProductExcel(product) {
  const schema = Joi.object({
    name: Joi.string().required(),
    unit: Joi.string(),
    barcode: Joi.any(),
    producttype: Joi.string(),
    width:Joi.number().default(0),
    code: Joi.number().required(),
    category: Joi.number(),
    brand: Joi.string(),
    incomingprice: Joi.number(),
    sellingprice: Joi.number(),
    incomingpriceuzs: Joi.number(),
    sellingpriceuzs: Joi.number(),
    tradeprice: Joi.number(),
    tradepriceuzs: Joi.number(),
    minimumcount: Joi.number(),
    total: Joi.number(),
  });

  return schema.validate(product);
}

module.exports.validateProduct = validateProduct;
module.exports.validateProductExcel = validateProductExcel;
module.exports.Product = model("Product", product);
