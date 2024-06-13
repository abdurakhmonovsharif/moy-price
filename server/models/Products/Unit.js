const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const unit = new Schema(
  {
    name: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

function validateUnit(unit) {
  const schema = Joi.object({
    name: Joi.string().required(),
    market: Joi.string().required(),
  })

  return schema.validate(unit)
}

module.exports.validateUnit = validateUnit
module.exports.Unit = model('Unit', unit)
