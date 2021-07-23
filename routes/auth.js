const express = require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const _ = require('lodash')
const {User} = require('../models/user');

const router = express.Router();

router.post('/', async(req,res)=>{
    const {error} = validate(_.pick(req.body, ['email', "password"]))
    if(error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("username or password is incorrect")

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("username or password is incorrect")

    const token = user.generateAuthToken();
    res.send(token);
})

function validate(data){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(6).max(255).required(),
    })
    return schema.validate(data);
}


module.exports = router;