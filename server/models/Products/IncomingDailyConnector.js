const { Schema, model } = require('mongoose');

const daily = new Schema(
  {
    id: { type: Number },
    comment: { type: String },
    incomingconnector: {
      type: Schema.Types.ObjectId,
      ref: 'IncomingConnector',
    },
    payment: { type: Schema.Types.ObjectId, ref: 'IncomingPayment' },
    incomings: [{ type: Schema.Types.ObjectId, ref: 'Incoming' }],
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    market: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isArchive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports.IncomingDailyConnector = model('IncomingDailyConnector', daily);
