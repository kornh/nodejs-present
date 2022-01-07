require('dotenv').config();

const glob = require("glob"),
    path = require("path"),
    crypto = require('crypto');

const dir = process.env.FILES_FOLDER,
    ext = process.env.FILES_SUFFIX;

var getList = function () {
    return glob.sync(dir + '/**/*' + ext);
}

var getPathList = function () {
    var filesList = getList();
    var arr = [];
    filesList.forEach((file) => {
        arr.push({
            file
        });
    });
    return arr;
};

var getHashedPathList = function () {
    var filesList = getPathList();
    filesList.forEach((item) => {
        item.hash = crypto.createHash('md5').update(item.file).digest('hex');
    });
    return filesList;
};

var getHashedList = function () {
    var filesList = getHashedPathList();
    filesList.forEach((item) => {
        item.filename = path.basename(item.file);
        delete item.file;
    });
    return filesList;
};

var getPathByHash = function (hash) {
    var filesList = getHashedPathList();
    filesList = filesList.filter((item) => {
        return item.hash === hash;
    });
    return filesList[0].file;
}

var toWinPath = function (path) {
    return path.split("/").join("\\");
}

module.exports = {
    getPathList,
    getHashedPathList,
    getHashedList,
    getPathByHash,
    toWinPath
}