const express = require('express');
const bcrypt = require('bcrypt');
const {User, validateUser} = require('../models/user');
const auth = require('../middleware/auth')
const _ = require('lodash')

const router = express.Router();

router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id ).select("-password")
    res.send(user)
})



router.post('/', async(req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({phone: req.body.phone})
    if(user) return res.status(400).send("The phone number already exist")
    if(req.body.email) {
        const user = await User.findOne({email: req.body.email})
        if(user) return res.status(400).send("The email already exist")
    }

    user = new User(_.pick(req.body, ["name", "phone", "email", "password"]));
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token)
        .header("Access-Control-Expose-Headers", "x-auth-token")
        .send(_.pick(user, ['name', 'email', 'phone', '_id']))
    
})


module.exports = router;