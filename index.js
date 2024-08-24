require('dotenv').config();
const express = require('express');
const app = express();
const logger= require('./middleware/logger');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Server started on port ${port}...`));

