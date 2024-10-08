const mongoose = require('mongoose');
const Joi = require('joi');



const rentalSchema = new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        isGold: {
            type:Boolean,
            default: false,
        },
        phoneNumber: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        }
        }),
        require:true
    },
    movie:{
        type: new mongoose.Schema({
            title:{
                type: String,
                required: true,
                trim:true,
                minlength: 1,
                maxlength: 255,
            },
            dailyRentalRate:{
                type:Number,
                required:true,
                min:0,
                max:1000
            },
        }),
        require:true
    },
    dateOut:{
        type:Date,
        required:true,
        default:Date.now
    },
    dataReturned:{
        type:Date,
    },
    rentalFee: {
        type:Number,
        min:0,
    }
});

rentalSchema.statics.lookup = function (customerId,movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
}

const Rental = mongoose.model('Rental',rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required()
    });

    return schema.validate(rental);
}


exports.Rental = Rental;
exports.validateRental = validateRental;