const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim:true,
        minlength: 1,
        maxlength: 255,
    },
    numberInStock:{
        type:Number,
        required:true,
        min:0,
        max:1000
    },
    dailyRentalRate:{
        type:Number,
        required:true,
        min:0,
        max:1000
    },
    genre:{
        type:genreSchema,
        required:true,
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(50).required(),
        genreId:Joi.objectId(),
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required(),
    });

    return schema.validate(movie)

}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
