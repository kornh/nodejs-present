require('dotenv').config();

const processWindows = require("node-process-windows");
const screenshot = require('screenshot-desktop');

var files = require('../utils/files');

const {
    spawn
} = require("child_process");
var robot = require("robotjs");

const command = process.env.EXEC_START,
    args = [process.env.EXEC_ARG0, ''];

var activeProcess = null,
    activeProcessWindow = null;

var callProcess = function (command, args) {
    if (!!activeProcess || !command) {
        return;
    }
    activeProcess = spawn(command, args);
    activeProcess.on('exit', function (code) {
        console.log('activeProcess closed');
        activeProcess = null;
        activeProcessWindow = null;
    }.bind(this));

    processWindows && processWindows.getProcesses(function (err, processes) {
        if (!activeProcess) {
            return;
        }
        var activePID = activeProcess.pid;
        var pptProcesses = processes && processes.filter(p => p.pid === activePID);
        if (pptProcesses && pptProcesses.length > 0) {
            activeProcessWindow = pptProcesses[0];
        }
    }.bind(this));
}

var focusWindowWithKey = function (key) {
    if (!key) {
        return;
    }
    processWindows.focusWindow(activeProcessWindow);
    setTimeout(function () {
        robot.keyTap(key);
    }, 100);
}

var logic = function (socket) {
    var statusFunction = function () {
        var status = {
            active: !!activeProcess
        }
        if (status.active) {
            status;
        }
        socket.emit('status', status);
    }

    console.log('a user connected');
    socket.on('#start', (fileHash) => {
        console.log("start: " + fileHash);
        var path = files.getPathByHash(fileHash);
        path = files.toWinPath(path);
        console.log("start: " + path);
        args[1] = path;
        console.log("start: " + command);
        callProcess(command, args);
        statusFunction();
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
        focusWindowWithKey("left");
    });
    socket.on('#right', (msg) => {
        focusWindowWithKey("right");
    });
    socket.on('#stop', (msg) => {
        focusWindowWithKey("escape");
        statusFunction();
    });
    socket.on('#file-list', (msg) => {
        var ret = files.getHashedList();
        socket.emit('fileList', ret);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    setInterval(statusFunction, 100);
}

module.exports = logic;