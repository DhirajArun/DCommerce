const express = require('express');
const {Product, validateProduct} = require('../models/product')
const _ = require('lodash')

const router = express.Router();

router.get('/', async(req, res) => {
    try{
        const products = await Product.find();
        res.send(products);
    }
    catch(ex){
        res.status(404).send("invalid filter")
    }
})

router.get('/:id', async(req, res)=>{
    try{
        const product = await Product.findOne({_id: req.params.id})
        if(!product) return res.status(404).send("no product found")
        res.send(product)
    }
    catch(ex){
        
    }
})


router.post('/', async (req, res) => {
    const {error} = validateProduct(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const product = new Product(_.pick(req.body, ["title", "images", "mrp", "off", "cat", "color", "size"]))
    
    try{
        await product.save()
        res.send(product)
    }
    catch(ex){
        res.send(400).send("invalid data")
    }


})

router.put('/:id', (req, res)=>{

})

router.delete('/:id', async(req, res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id)
        if(!product) return res.status(404).send("no such product");
        res.send(product)
    }
    catch(ex){
        
    }
})


module.exports = router;