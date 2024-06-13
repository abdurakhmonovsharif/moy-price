const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const exchangerate = new Schema(
  {
    exchangerate: { type: Number, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

function validateExchangerate(exchangerate) {
  const schema = Joi.object({
    exchangerate: Joi.number().required(),
    market: Joi.string().required(),
    isIncomingPrice: Joi.boolean().optional(),
    isSellingPrice: Joi.boolean().optional(),
  })

  return schema.validate(exchangerate)
}

module.exports.validateExchangerate = validateExchangerate
module.exports.Exchangerate = model('Exchangerate', exchangerate)
