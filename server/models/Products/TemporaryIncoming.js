const { Schema, model } = require('mongoose');
const Joi = require('joi');

const temporaryincoming = new Schema(
  {
    temporaryincoming: { type: Object },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateTemporaryIncoming(temporaryincoming) {
  const schema = Joi.object({
    temporaryincoming: Joi.object().required(),
    market: Joi.string().required(),
  });

  return schema.validate(temporaryincoming);
}

module.exports.validateTemporaryIncoming = validateTemporaryIncoming;
module.exports.TemporaryIncoming = model(
  'TemporaryIncoming',
  temporaryincoming
);
