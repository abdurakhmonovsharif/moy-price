const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const brand = new Schema(
  {
    name: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Clinica', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

function validateBrand(brand) {
  const schema = Joi.object({
    name: Joi.string().required(),
    market: Joi.string().required(),
  })

  return schema.validate(brand)
}

module.exports.validateBrand = validateBrand
module.exports.Brand = model('Brand', brand)
