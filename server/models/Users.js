const {Schema, model, Types} = require('mongoose')
const Joi = require('joi')

const user = new Schema(
    {
        login: {type: String, required: true},
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        fathername: {type: String},
        image: {type: String},
        qrcode: {type: String},
        phone: {type: String},
        password: {type: String, min: 6, required: true},
        market: {type: Schema.Types.ObjectId, ref: 'Market'}, // o'zini marketi
        type: {type: String, required: true},
        users: [{type: Schema.Types.ObjectId, ref: 'User'}], // Xodimlar
        user: {type: Schema.Types.ObjectId, ref: 'User'}, // Director
        isIncomePage: {type: Boolean},
        isArchive: {type: Boolean, default: false},
        administrator: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true
    }
)

function validateUser(user) {
    const schema = Joi.object({
        login: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        fathername: Joi.string().allow('').optional(),
        image: Joi.string().allow('').optional(),
        qrcode: Joi.string().allow('').optional(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        market: Joi.string().required(),
        type: Joi.string().optional(),
        specialty: Joi.string(),
        users: Joi.array(),
        user: Joi.string(),
        _id: Joi.string(),
        administrator: Joi.string().required()
    })

    return schema.validate(user)
}

function validateEditUser(user) {
    const schema = Joi.object({
        _id: Joi.string().required(),
        login: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        password: Joi.string().required(),
        market: Joi.string().required(),
        image: Joi.string().allow('').optional(),
        qrcode: Joi.string().allow('').optional(),
        phone: Joi.string().allow("").optional(),
        fathername: Joi.string().allow("").optional(),
        administrator: Joi.string().allow("").optional(),
    })

    return schema.validate(user)
}

function validateSeller(user) {
    const schema = Joi.object({
        login: Joi.string().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        fathername: Joi.string(),
        image: Joi.string().allow('').optional(),
        phone: Joi.string().required(),
        password: Joi.string().required(),
        market: Joi.string().required(),
        type: Joi.string().required(),
        isIncomePage: Joi.boolean().optional(),
        specialty: Joi.string(),
        users: Joi.array(),
        user: Joi.string(),
        _id: Joi.string()
    })

    return schema.validate(user)
}

function validateUserLogin(user) {
    const schema = Joi.object({
        password: Joi.string().required(),
        login: Joi.string().required()
    })

    return schema.validate(user)
}

function validateAdministration(administration) {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string(),
        login: Joi.string().required(),
        image: Joi.string()
    })
    return schema.validate(administration)
}

module.exports.validateEditUser = validateEditUser
module.exports.validateSeller = validateSeller
module.exports.validateAdministration = validateAdministration
module.exports.validateUser = validateUser
module.exports.validateUserLogin = validateUserLogin
module.exports.User = model('User', user)
