const {
    Server
} = require("socket.io");

module.exports = function (server) {
    return new Server(server);
}