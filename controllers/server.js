require('dotenv').config();

const express = require('express'),
    app = express();

app.use(express.static('public'));

const http = require('http'),
    server = http.createServer(app);

const port = process.env.APP_PORT;
server.listen(port, () => {
    console.log('listening on *:' + port);
});

module.exports = {
    app,
    server
};