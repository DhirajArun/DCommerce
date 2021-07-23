const express = require('express');
const products = require('../routes/products');
const user = require('../routes/users')
const auth = require('../routes/auth')

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/user', user);
    app.use('/api/products', products);
    app.use('/api/auth', auth)
}