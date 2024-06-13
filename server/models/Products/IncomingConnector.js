const { Schema, model, Types } = require('mongoose');
const Joi = require('joi');

const incomingconnector = new Schema(
  {
    id: { type: String },
    payments: [{ type: Schema.Types.ObjectId, ref: 'IncomingPayment' }],
    incomingdailyconnectors: [
      { type: Schema.Types.ObjectId, ref: 'IncomingDailyConnector' },
    ],
    total: { type: Number },
    totaluzs: { type: Number },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    incoming: [{ type: Schema.Types.ObjectId, ref: 'Incoming' }],
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateIncomingConnector(incomingconnector) {
  const schema = Joi.object({
    total: Joi.number(),
    totaluzs: Joi.number(),
    supplier: Joi.string(),
    incoming: Joi.array(),
    user: Joi.string(),
    market: Joi.string(),
  });

  return schema.validate(incomingconnector);
}

module.exports.validateIncomingConnector = validateIncomingConnector;
module.exports.IncomingConnector = model(
  'IncomingConnector',
  incomingconnector
);
