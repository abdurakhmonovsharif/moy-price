const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const packman = new Schema(
  {
    name: { type: String, required: true },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    isArchive: { type: Boolean, default: false },
    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Client',
      },
    ],
  },
  {
    timestamps: true,
  },
)

function validatePackman(packman) {
  const schema = Joi.object({
    name: Joi.string().required(),
    market: Joi.string().required(),
  })

  return schema.validate(packman)
}

module.exports.validatePackman = validatePackman
module.exports.Packman = model('Packman', packman)
