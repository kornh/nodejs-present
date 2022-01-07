require('dotenv').config();

var files = require('../utils/files');

const screenshot = require('screenshot-desktop');
const {
    exec
} = require("child_process");
var robot = require("robotjs");

const command = 'start ' + process.env.EXEC_START + ' ';

var logic = function (socket) {
    console.log('a user connected');
    socket.on('#start', (fileHash) => {
        console.log("start: " + fileHash);
        var path = files.getPathByHash(fileHash);
        path = files.toWinPath(path);
        console.log("start: " + path);
        var cli = command + "\"" + path + "\"";
        console.log("start: " + cli);
        exec(cli);
    });
    socket.on('#screen', (msg) => {
        screenshot.all({
            format: 'png'
        }).then((img) => {
            socket.emit('image', img);
        }).catch((err) => {
            // ...
        })
    });
    socket.on('#left', (msg) => {
        robot.keyTap("left");
    });
    socket.on('#right', (msg) => {
        robot.keyTap("right");
    });
    socket.on('#stop', (msg) => {
        robot.keyTap("escape");
    });
    socket.on('#file-list', (msg) => {
        var ret = files.getHashedList();
        socket.emit('fileList', ret);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
}

module.exports = logic;