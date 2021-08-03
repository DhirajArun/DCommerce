const express = require('express');
const {Product, validateProduct} = require('../models/product')
const _ = require('lodash')

const router = express.Router();

router.get('/', async(req, res) => {
    const products = await Product.find();
    res.send(products);
})

router.get('/:id', async(req, res)=>{
    const product = await Product.findOne({_id: req.params.id})
    if(!product) return res.status(404).send("no product found")
    res.send(product)
})


router.post('/', async (req, res) => {
    const {error} = validateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const product = new Product(_.pick(req.body, ["title", "images", "mrp", "off", "cat", "color", "size"]))
    
  
    await product.save()
    res.send(product)
    
})

router.put('/:id', async(req, res)=>{
    const {error} = validateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message)


    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!product) return res.status(404).send("no such product found!")
    res.send(product)
})

router.delete('/:id', async(req, res)=>{
    const product = await Product.findByIdAndDelete(req.params.id)
    if(!product) return res.status(404).send("no such product");
    res.send(product)
})


module.exports = router;