const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const expense = new Schema(
  {
    sum: { type: Number, required: true },
    sumuzs: { type: Number, required: true },
    type: { type: String, required: true },
    comment: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateExpense(expense) {
  const schema = Joi.object({
    sum: Joi.number().required(),
    sumuzs: Joi.number().required(),
    type: Joi.string().required(),
    comment: Joi.string().required(),
    market: Joi.string().required(),
  });

  return schema.validate(expense);
}

module.exports.validateExpense = validateExpense;
module.exports.Expense = model('Expense', expense);
