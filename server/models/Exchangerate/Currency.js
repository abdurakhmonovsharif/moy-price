const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const currency = new Schema(
  {
    currency: { type: String, required: true, default: 'UZS' },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateCurrency(currency) {
  const schema = Joi.object({
    currency: Joi.string().required(),
    market: Joi.string().required(),
  });

  return schema.validate(currency);
}

module.exports.validateCurrency = validateCurrency;
module.exports.Currency = model('Currency', currency);
