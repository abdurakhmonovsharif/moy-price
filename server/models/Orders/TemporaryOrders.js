const { Schema, model } = require("mongoose");
const Joi = require("joi");

const temporary = new Schema(
  {
    temporary: { type: Object },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateTemporary(temporary) {
  const schema = Joi.object({
    temporary: Joi.object().required(),
    market: Joi.string().required(),
  });

  return schema.validate(temporary);
}

module.exports.validateTemporary = validateTemporary;
module.exports.TemporaryOrders = model("TemporaryOrders", temporary);
