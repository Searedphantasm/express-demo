const asyncMiddleware = require("../middleware/async");
const express = require("express");
const {Rental} = require("../models/rental");
const auth = require("../middleware/auth");
const moment = require("moment");
const {Movie} = require("../models/movie");
const Joi = require("joi");
const router = express.Router();
const validate = require('../middleware/validate');



router.post('/',[auth,validate(validateReturn)],asyncMiddleware(async (req, res,next) => {

    const rental = await Rental.lookup(req.body.customerId,req.body.movieId);

    if (!rental) return res.status(404).send("Rental not found.");

    if (rental.dataReturned) return res.status(400).send("Return already processed.");

    rental.dataReturned = new Date();
    rental.rentalFee = moment().diff(rental.dateOut,'days') * rental.movie.dailyRentalRate;

    await rental.save();


    await Movie.updateOne({ _id:rental.movie._id} , {
        $inc: {numberInStock:1,}
    });

    return res.status(200).send(rental);

}));

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(req);
}

module.exports = router;