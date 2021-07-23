const mongoose = require('mongoose');
const config = require('config');

module.exports = function (){
    const db = config.get("db");
    mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    const mongodb = mongoose.connection;
    mongodb.on('error', console.error.bind(console, 'connection error:'));
    mongodb.once("open", ()=> {
        console.log(`connect to ${db}...`)
    })
}