const Joi = require('joi');
const { Schema, Types, model } = require('mongoose');

const transfer = new Schema(
  {
    id: { type: String },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    filial: { type: Schema.Types.ObjectId, ref: 'Market' },
    products: [{ type: Schema.Types.ObjectId, ref: 'TransferProduct' }],
    pieces: { type: Number },
    totalincomingprice: { type: Number },
    totalincomingpriceuzs: { type: Number },
    totalsellingprice: { type: Number },
    totalsellingpriceuzs: { type: Number },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateTransfer(transfer) {
  const schema = Joi.object({
    market: Joi.string().required(),
    filial: Joi.string().required(),
    products: Joi.array().required(),
  });
  return schema.validate(transfer);
}

module.exports.validateTransfer = validateTransfer;
module.exports.Transfer = model('Transfer', transfer);
