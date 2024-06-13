const { Schema, model } = require('mongoose');

const transferproducts = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productdata: { type: Schema.Types.ObjectId, ref: 'ProductData' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
    pieces: { type: Number },
    price: { type: Schema.Types.ObjectId, ref: 'ProductPrice' },
    transfer: { type: Schema.Types.ObjectId, ref: 'Transfer' },
    isArchive: { type: Boolean, default: false },
    market: { type: Schema.Types.ObjectId, ref: 'Market' },
    filial: { type: Schema.Types.ObjectId, ref: 'Market' },
    filialproduct: { type: Schema.Types.ObjectId, ref: 'Product' },
  },
  {
    timestamps: true,
  }
);

module.exports.TransferProduct = model('TransferProduct', transferproducts);
