const Joi = require('joi');
const { Schema, model } = require('mongoose');

const temporary = new Schema(
  {
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    filial: { type: Schema.Types.ObjectId, ref: 'Market' },
    temporary: [{ type: Object }],
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateTemporary(temporary) {
  const schema = Joi.object({
    temporary: Joi.array().required(),
    market: Joi.string().required(),
  });

  return schema.validate(temporary);
}

module.exports.validate = validateTemporary;
module.exports.TemporaryTransfer = model('TemporaryTransfer', temporary);
