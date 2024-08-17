const express = require('express');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const {Customer} = require("../models/customer");
const {Movie} = require("../models/movie");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});


router.post('/', auth,async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer:{
            _id:customer._id,
            name:customer.name,
            phoneNumber:customer.phoneNumber
        },
        movie: {
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        },

    });

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        // TODO Add your statement here
        rental = await rental.save();

        movie.numberInStock--;
        movie.save();
        // Commit the changes
        await session.commitTransaction();
    } catch (error) {
        // Rollback any changes made in the database
        await session.abortTransaction();

        // Rethrow the error
        throw error;
    } finally {
        // Ending the session
        await session.endSession();
    }
    res.send(rental)
});


module.exports = router;