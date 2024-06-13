const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const barcode = new Schema(
  {
    mxik: { type: String },
    group: { type: String },
    class: { type: String },
    position: { type: String },
    subposition: { type: String },
    position: { type: String },
    brand: { type: String },
    name: { type: String },
    unit: { type: String },
    unitcode: { type: Number },
    barcode: { type: String },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateBarcode(barcode) {
  const schema = Joi.object({
    _id: Joi.string(),
    barcode: Joi.string().required(),
    mxik: Joi.string(),
    group: Joi.string(),
    class: Joi.string(),
    position: Joi.string(),
    subposition: Joi.string(),
    brand: Joi.string(),
    unitcode: Joi.string(),
    unit: Joi.string(),
    group: Joi.string(),
    name: Joi.string().required(),
  });

  return schema.validate(barcode);
}

module.exports.validateBarcode = validateBarcode;
module.exports.Barcode = model("Barcode", barcode);
