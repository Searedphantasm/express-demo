require('dotenv').config();
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const helmet = require("helmet");
const morgan = require("morgan");
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require("./routes/users");
const auth = require("./routes/auth");
const error = require("./middleware/error");
const express = require('express');
const app = express();



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


app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/', home);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

console.log("Application Name:" + config.get('name'));

if (process.env.NODE_ENV === "development") {
    app.use(morgan('tiny'));
    startupDebugger("Using Morgan");
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}...`));

