const { Schema, model } = require("mongoose");
const Joi = require("joi");

const connection = new Schema(
  {
    first: { type: Schema.Types.ObjectId, ref: "Market" },
    second: { type: Schema.Types.ObjectId, ref: "Market" },
    request: { type: Boolean, default: false },
    accept: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

function validateConnection(connection) {
  const schema = Joi.object({
    first: Joi.string().required(),
    second: Joi.string().required(),
    request: Joi.boolean(),
    accept: Joi.boolean(),
    rejected: Joi.boolean(),
    isArchive: Joi.boolean(),
  });

  return schema.validate(connection);
}

module.exports.validateConnection = validateConnection;
module.exports.Connection = model("Connection", connection);
