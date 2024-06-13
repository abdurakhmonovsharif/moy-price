const { Schema, model } = require('mongoose');
const Joi = require('joi');

const inventory = new Schema(
  {
    inventoryConnector: {
      type: Schema.Types.ObjectId,
      ref: 'InventoriesConnector',
      required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productdata: { type: Schema.Types.ObjectId, ref: 'ProductData' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Schema.Types.ObjectId, ref: 'ProductPrice' },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
    productcount: { type: Number },
    inventorycount: { type: Number },
    comment: { type: String },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateInventory(inventory) {
  const schema = Joi.object({
    unit: Joi.string(),
    code: Joi.string(),
    price: Joi.string(),
    product: Joi.string(),
    category: Joi.string(),
    productcount: Joi.number(),
    inventorycount: Joi.number(),
    brand: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(inventory);
}

module.exports.validateInventory = validateInventory;
module.exports.Inventory = model('Inventory', inventory);
