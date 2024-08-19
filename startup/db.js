const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function () {
    mongoose.connect("mongodb://localhost:27017/vidly")
    .then(() => winston.add(new winston.transports.File({filename:"logfile.log",level:"info"})).info("Connected to MongoDB"));
}