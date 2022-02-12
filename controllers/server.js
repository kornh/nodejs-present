require('dotenv').config();

const express = require('express'),
    app = express();

var mode = process.env.MODE;
if (!mode) {
    mode = 'webapp';
}
app.use(express.static(mode));

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