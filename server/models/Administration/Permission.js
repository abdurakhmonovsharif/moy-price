const { Schema, model } = require('mongoose');
const Joi = require('joi');

const permisson = new Schema(
  {
    creates: { type: Boolean, default: false },
    incomings: { type: Boolean, default: false },
    inventories: { type: Boolean, default: false },
    sales: { type: Boolean, default: false },
    reporters: { type: Boolean, default: false },
    sellers: { type: Boolean, default: false },
    calculations: { type: Boolean, default: false },
    branches: { type: Boolean, default: false },
    mainmarket: { type: Boolean, default: false },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
  },
  {
    timestamps: true,
  }
);

function validatePermission(permisson) {
  const schema = Joi.object({
    creates: Joi.boolean(),
    incomings: Joi.boolean(),
    inventories: Joi.boolean(),
    sales: Joi.boolean(),
    reporters: Joi.boolean(),
    sellers: Joi.boolean(),
    calculations: Joi.boolean(),
    branches: Joi.boolean(),
    mainmarket: Joi.boolean(),
    market: Joi.string(),
  });

  return schema.validate(permisson);
}

module.exports.validatePermission = validatePermission;
module.exports.Permission = model('Permission', permisson);
