const {
    exec
} = require("child_process");
// Get pixel color under the mouse.
var robot = require("robotjs");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const files = require('./files');

const screenshot = require('screenshot-desktop')

const testFolder = 'C:\\Users\\CBGH\\Desktop\\Livestream Folien';
const suffix = ".pptx";
var command = 'start powerpnt.exe /S ';

const {
    Server
} = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/files', (req, res) => {
    var ret = files.getHashedList(testFolder, suffix);
    res.json(ret)
});



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('#start', (fileHash) => {
        console.log("start: " + fileHash);
        var path = files.getPathByHash(testFolder, suffix, fileHash);
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
        var ret = files.getHashedList(testFolder, suffix);
        socket.emit('fileList', ret);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});