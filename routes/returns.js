const asyncMiddleware = require("../middleware/async");
const express = require("express");
const router = express.Router();

router.post('/', asyncMiddleware(async (req, res,next) => {
    res.status(401).send('Unauthorized');
}));


module.exports = router;