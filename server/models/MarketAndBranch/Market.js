const {Schema, model} = require('mongoose')
const Joi = require('joi')

const market = new Schema(
    {
        name: {type: String, required: true},
        organitionName: {type: String},
        image: {type: String},
        qrcode: {type: String},
        phone1: {type: String},
        phone2: {type: String},
        phone3: {type: String},
        bank: {type: String},
        bankNumber: {type: String},
        inn: {type: Number},
        SMS_API_KEY:{type:String,default:null},
        mfo: {type: Number},
        address: {type: String},
        orientation: {type: String},
        isArchive: {type: Boolean, default: false},
        director: {type: Schema.Types.ObjectId, ref: 'User'},
        market: {type: Schema.Types.ObjectId, ref: 'Market'},
        mainmarket: {type: Schema.Types.ObjectId, ref: 'Market'},
        filials: [{type: Schema.Types.ObjectId, ref: 'Market'}],
        connections: [{type: Schema.Types.ObjectId, ref: 'Market'}],
        permission: {type: Schema.Types.ObjectId, ref: 'Permission'},
        administrator: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        timestamps: true
    }
)

function validateMarket(market) {
    const schema = Joi.object({
        name: Joi.string().required(),
        organitionName: Joi.string().required(),
        image: Joi.string().allow('').optional(),
        phone1: Joi.string().required().optional(),
        SMS_API_KEY: Joi.string().optional(),
        phone2: Joi.string().allow('').optional(),
        phone3: Joi.string().allow('').optional(),
        bank: Joi.string().allow('').optional(),
        bankNumber: Joi.string().allow('').optional(),
        inn: Joi.number().allow(0).optional(),
        mfo: Joi.number().allow('').optional(),
        address: Joi.string().allow('').optional(),
        orientation: Joi.string().allow('').optional(),
        market: Joi.string().allow('').optional(),
        administrator: Joi.string().required()
    })

    return schema.validate(market)
}

module.exports.validateMarket = validateMarket
module.exports.Market = model('Market', market)
