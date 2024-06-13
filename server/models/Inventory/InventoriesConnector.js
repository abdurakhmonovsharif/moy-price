const { Schema, model } = require('mongoose');
const Joi = require('joi');

const inventoryConnector = new Schema(
  {
    id: { type: String, required: true },
    inventories: [{ type: Schema.Types.ObjectId, ref: 'Inventory' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    completed: { type: Boolean, default: false },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateInventoryConnector(inventoryConnector) {
  const schema = Joi.object({
    id: Joi.string(),
    inventory: Joi.array(),
    completed: Joi.boolean(),
    user: Joi.string(),
    market: Joi.string().required(),
  });

  return schema.validate(inventoryConnector);
}

module.exports.validateInventoryConnector = validateInventoryConnector;
module.exports.InventoryConnector = model(
  'InventoryConnector',
  inventoryConnector
);
