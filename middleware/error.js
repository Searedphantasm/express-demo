
module.exports = function(err,req, res, next) {
   // TODO: log exception
    res.status(500).send("Something went wrong!");
}