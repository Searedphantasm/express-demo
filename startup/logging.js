const logger = require("../middleware/logger");
const {transports} = require("winston");
const winston = require("winston");

module.exports = function () {

    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({filename:"exception.log"})
    )

   winston.rejections.handle(
        new transports.File({ filename: 'rejections.log' })
    );
}