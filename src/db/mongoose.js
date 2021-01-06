const mongoose = require('mongoose');

// Load Mongodb config URL
const db = require('../config/keys_dev');

mongoose
    .connect(db.mongodbURL, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('Mongodb connected!'))
    .catch((error) => console.log(error));
