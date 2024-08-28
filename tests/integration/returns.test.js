const {Rental} = require("../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest")
const {User} = require("../../models/user");

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    beforeEach( async () => {
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

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
        await server.close();
        await Rental.deleteMany({});
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
});