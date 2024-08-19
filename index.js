require('dotenv').config();
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const helmet = require("helmet");
const morgan = require("morgan");


const express = require('express');
const app = express();
require('./startup/routes')(app);


process.on('uncaughtException', (reason) => {
    logger.error(reason.message, reason);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error(reason.message, reason);
    process.exit(1);
});

if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: jwtPrivateKey is missing!");
    process.exit(1);
}

mongoose.connect("mongodb://localhost:27017/vidly")
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error("Could not connect to mongodb: ", err.message));

app.set('view engine', 'pug');
app.set('views', './views'); // default

app.use(express.json());
app.use(express.urlencoded({extended: true})); // key=value&name=Parsa -> req.body
app.use(express.static('public')); // css , image ,
app.use(helmet());


console.log("Application Name:" + config.get('name'));

if (process.env.NODE_ENV === "development") {
    app.use(morgan('tiny'));
    startupDebugger("Using Morgan");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}...`));

