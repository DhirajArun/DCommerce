const express = require('express');
const {ProductCat, validateProductCat} = require('../models/productCat')
const _ = require('lodash')

const router = express.Router();

router.get('/', async(req, res) => {

    const cats = await ProductCat.find();
    res.send(cats);
 
})

router.get('/:id', async(req, res)=>{
    const cats = await ProductCat.findOne({_id: req.params.id})
    if(!cats) return res.status(404).send("no products cateogories found")
    res.send(cats)
})


router.post('/', async (req, res) => {
    const {error} = validateProductCat(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const cat = new ProductCat(_.pick(req.body, ["name"]))
    
   
    await cat.save()
    res.send(cat)
})

router.put('/:id', async(req, res)=>{
    const {error} = validateProductCat(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    const productCat = await ProductCat.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!productCat) return res.status(404).send("no such product cateogory found!")
    res.send(productCat)

})

router.delete('/:id', async(req, res)=>{
    const cat = await ProductCat.findByIdAndDelete(req.params.id)
    if(!cat) return res.status(404).send("no such cateogory");
    res.send(cat)
})


module.exports = router;