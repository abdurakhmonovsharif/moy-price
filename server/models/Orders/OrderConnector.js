const { Schema, model } = require("mongoose");

const orderConnector = new Schema(
  {
    id: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    market: { type: Schema.Types.ObjectId, ref: "Market", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "OrderProduct" }],
    totalprice: { type: Number, default: 0 },
    totalpriceuzs: { type: Number, default: 0 },
    position: {
      type: String,
      required: true,
    },
    positions: {
      type: Array,
      default: [
        "requested",
        "accepted",
        "rejected",
        "send",
        "delivered",
        "completedcustomer",
        "completedsender",
      ],
    },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports.OrderConnector = model("OrderConnector", orderConnector);
