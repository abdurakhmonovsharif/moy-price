const Joi = require('joi');
const { Schema, Types, model } = require('mongoose');
require('../MarketAndBranch/Market')
require('../Products/Product')

const warhouseproduct = new Schema(
    {
        market: { type: Schema.Types.ObjectId, ref: 'Market' },
        filial: { type: Schema.Types.ObjectId, ref: 'Market' },
        product: { type: Object },
    },
    {
        timestamps: true,
    }
);


module.exports.WarhouseProduct = model('WarhouseProduct', warhouseproduct);