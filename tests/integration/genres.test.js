const request = require('supertest');
const {Genre} = require('../../models/genre')
const {User} = require('../../models/user');
const mongoose = require("mongoose");
let server;

describe('/api/genres', () => {

    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres',async () => {
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'},
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed',async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+ genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed',async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists',async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        // Define the happy path , and then in each test,
        // we change one parameter that clearly aligns with the name of the
        // test.
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name:name})
        }

        beforeEach(async () => {
            token = new User().generateAuthToken();
            name = "genre1"
        });

        it('should return 401 if client is not logged in.', async () => {
            token = "";

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 char.', async () => {
            name = "1234";

            const res = await exec();

            expect(res.status).toBe(400);
        });

         it('should return 400 if genre is more than 50 char.', async () => {
            name = new Array(52).join("a")

            const res = await exec()

            expect(res.status).toBe(400);
        });

        it('should save the genre if the input valid.', async () => {
            await exec()

            const genre = await Genre.find({name:"genre1"})
            expect(genre).not.toBeNull();
        });
        it('should return the genre if the input valid.', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name","genre1");
        });
    });

    describe('PUT /:id', () => {
        let token;
        let newName;
        let id;
        let genre;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name:newName})
        }

        beforeEach(async () => {

            genre = new Genre({name:'genre1'});
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = "updatedName";
        });

        it('should return 401 if client is not logged in.',async () => {
            token = " ";

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters.',async () => {
            newName = "1234"

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters.',async () => {
            newName = new Array(52).join("a")

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre id is invalid.',async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre with the given id is not found.',async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid.',async () => {
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName);
        });

        it('should return the updated genre if it is valid', async () => {
              const res = await exec();

              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('name', newName);
        });

    });

    describe('DELETE /:id', () => {
        let token;
        let id;
        let genre;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }


        beforeEach(async () => {
            genre = new Genre({name:'genre1'});
            await genre.save();

            token = new User({isAdmin:true}).generateAuthToken();
            id = genre._id;
        });

        it('should return 401 if client is nor logged in.', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not admin.', async () => {
            token = new User({isAdmin:false}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
        
        it('should return 404 if the id is invalid.', async () => {
            
            id = 1
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
        
        it('should return 404 if no genre with given id was found.', async () => {
            id = new mongoose.Types.ObjectId();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
        
        it('should delete the genre if the given input is valid.', async () => {
            await exec();
            
            const genreInDb = await Genre.findById(genre._id);
            
            expect(genreInDb).toBeNull();
        });

        it('should return the removed genre.',async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id',genre._id.toHexString());
            expect(res.body).toHaveProperty('name',genre.name);
        });

    });

});