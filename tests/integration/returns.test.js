const moment = require("moment")
const {Rental} = require("../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest")
const {User} = require("../../models/user");
const {Movie} = require("../../models/movie");

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    beforeEach( async () => {
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id:movieId,
            title:"12345",
            dailyRentalRate:2,
            genre:{ name:"12345"},
            numberInStock:10
        });

        await movie.save()

        rental = new Rental({
            customer: {
                _id:customerId,
                name: 'John Doe',
                phoneNumber: '012345'
            },
            movie:{
                _id:movieId,
                title:"Movie title",
                dailyRentalRate:2
            }
        });
        await rental.save();
    });
    afterEach(async () => {
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close();
    });

    const exec = async () => {
        return await request(server).post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId: customerId , movieId: movieId });
    }

    it('should return 401 if client is not logged in', async () => {
        token = "";
        const res =  await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customer id is not provided.', async () => {
        customerId = ""
        const res =  await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movie id is not provided.', async () => {
        movieId = ""
        const res =  await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found or the customer/movie.', async () => {
        await Rental.deleteMany({});
        const res =  await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed.', async () => {
        rental.dataReturned = new Date();
        await rental.save();

        const res =  await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have valid request.', async () => {
            const res =  await exec();

            expect(res.status).toBe(200);
    });

    it('should set the returnDate it input is valid.', async () => {
            const res =  await exec();

            const rentalInBb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInBb.dataReturned;
            expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the rentalFee if input is valid.',async () => {

        rental.dateOut = moment().add(-7,'days').toDate()
        await rental.save()

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if input is valid.',async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid.',async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id)

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut','dataReturned','rentalFee','customer','movie']));
    });


});