const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const saleconnector = new Schema(
  {
    id: { type: String },
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    dailyconnectors: [
      { type: Schema.Types.ObjectId, ref: 'DailySaleConnector' },
    ],
    products: [{ type: Schema.Types.ObjectId, ref: 'SaleProduct' }],
    discounts: [{ type: Schema.Types.ObjectId, ref: 'Discount' }],
    debts: [{ type: Schema.Types.ObjectId, ref: 'Debt' }],
    packman: { type: Schema.Types.ObjectId, ref: 'Packman' },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateSaleConnector(saleconnector) {
  const schema = Joi.object({
    id: Joi.string(),
    payments: Joi.array(),
    discounts: Joi.array(),
    debts: Joi.string(),
    packman: Joi.string(),
    client: Joi.string(),
    user: Joi.string(),
    products: Joi.array(),
    market: Joi.string(),
  });

  return schema.validate(saleconnector);
}

module.exports.validateSaleConnector = validateSaleConnector;
module.exports.SaleConnector = model('SaleConnector', saleconnector);
