const {
    app,
    server
} = require('./server');

const io = require('./socket')(server);

const logic = require('./logic');

module.exports = {
    app,
    server,
    io,
    logic
}