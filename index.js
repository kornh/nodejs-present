require('dotenv').config();

const {
    io,
    logic
} = require('./controllers');

io.on('connection', logic);