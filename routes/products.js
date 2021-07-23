const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send({products: ["hello", "me", "you"]})
})

router.get('/:id', (req, res)=>{

})

router.post('/', (req, res) => {

})

router.put('/:id', (req, res)=>{

})

router.delete('/:id', (req, res)=>{

})


module.exports = router;