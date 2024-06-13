const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const supplier = new Schema(
  {
    name: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

function validateSupplier(supplier) {
  const schema = Joi.object({
    name: Joi.string().required(),
    market: Joi.string().required(),
  })

  return schema.validate(supplier)
}

module.exports.validateSupplier = validateSupplier
module.exports.Supplier = model('Supplier', supplier)
