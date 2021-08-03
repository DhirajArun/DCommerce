module.exports = function(err, req, res, next){
    //logging the error

    res.status(500).send("an unexpected error occured");
}