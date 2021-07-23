const Joi = require("joi")
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    cateogories: [],
})

const Products = mongoose.model('products', productSchema);

exports.Products = Products