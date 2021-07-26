const express = require("express");

const app = express();


require('./startup/routes')(app);
require('./startup/db')();



const port = process.env.PORT || 3100
app.listen(port, ()=> console.log(`listening on port ${port}`))