const express = require('express');
const {ProductCat, validateProductCat} = require('../models/productCat')
const _ = require('lodash')

const router = express.Router();

router.get('/', async(req, res) => {
    try{
        const cats = await ProductCat.find();
        res.send(cats);
    }
    catch(ex){
        res.status(404).send("invalid filter")
    }
})

router.get('/:id', async(req, res)=>{
    try{
        const cats = await ProductCat.findOne({_id: req.params.id})
        if(!cats) return res.status(404).send("no products cateogories found")
        res.send(cats)
    }
    catch(ex){
        
    }
})


router.post('/', async (req, res) => {
    const {error} = validateProductCat(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    const cat = new ProductCat(_.pick(req.body, ["name"]))
    
    try{
        await cat.save()
        res.send(cat)
    }
    catch(ex){
        res.send(400).send("invalid data")
    }


})

router.put('/:id', (req, res)=>{

})

router.delete('/:id', async(req, res)=>{
    try{
        const cat = await ProductCat.findByIdAndDelete(req.params.id)
        if(!cat) return res.status(404).send("no such cateogory");
        res.send(cat)
    }
    catch(ex){
        
    }
})


module.exports = router;