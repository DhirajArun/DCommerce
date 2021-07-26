const mongoose = require('mongoose');
const Joi = require('joi')

const ccSchema = new mongoose.Schema({
    country: {
        type: String,
        minlength: 2,
        maxlength: 25,
        trim: true,
        required: true
    },
    code: {
        type: String,
        match: /^\d{1,3}$/g,
        required: true
    },
    alias: {
        type: "String",
        set: (v) =>{ this.alias = v.replace(/\s/g, '')},
        uppercase: true,
        minlength: 1,
        maxlength: 10,
        required: true
    }
})

const CountryCode = mongoose.model('CountryCode', ccSchema)

function validateCC(data){
    const schema = Joi.object({
        country: Joi.string().min(2).max(25).trim().required(),
        code: Joi.string().pattern(/^\d{1,3}$/g).required(),
        alias: Joi.string().min(1).max(10).required(true)
    })
}


exports.CountryCode = CountryCode;