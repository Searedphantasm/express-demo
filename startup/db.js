const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config")

module.exports = function () {
    const db = config.get('db')
    mongoose.connect(db)
    .then(() => winston.add(new winston.transports.File({filename:"logfile.log",level:"info"})).info(`Connected to ${db}`));
    console.log(`Connected to ${db}`);
}