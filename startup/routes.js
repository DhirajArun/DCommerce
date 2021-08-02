const express = require('express');
const products = require("../routes/products")
const users = require('../routes/users')
const auth = require('../routes/auth')
const cors = require('cors');



module.exports = function(app) {
    app.use(cors({
        origin: "http://localhost:3000"
    }))
    app.use(express.json());
    app.use('/api/products', products);
    app.use('/api/users', users);
    app.use('/api/auth', auth)

}