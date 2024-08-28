const validateObjectId = require('../middleware/validateObjectId')
const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const express = require('express');
const router = express.Router();
const {Genre,validateGenre} = require('../models/genre');
const asyncMiddleware = require('../middleware/async');
const mongoose = require("mongoose");

// get all
router.get('/', asyncMiddleware(async (req, res,next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

router.post('/',auth,asyncMiddleware(async (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name,})
    genre = await genre.save();
    res.send(genre);
}))

router.get('/:id',validateObjectId,asyncMiddleware(async (req, res) => {



    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send('No genre found.');

    res.send(genre);
}));

router.put('/:id',[auth,validateObjectId],asyncMiddleware(async (req, res) => {
    const {error} = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name, }, {new: true})

    if (!genre) return res.status(404).send('No genre found.');

    res.send(genre);
}));

router.delete('/:id', [auth,admin,validateObjectId],asyncMiddleware(async (req, res) => {

    const genre = await Genre.findByIdAndDelete(req.params.id)

    if (!genre) return res.status(404).send('No genre found.');

    res.send(genre);
}))


module.exports = router;

