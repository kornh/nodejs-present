const glob = require("glob"),
    path = require("path"),
    crypto = require('crypto');


var getList = function (dir, ext) {
    return glob.sync(dir + '/**/*' + ext);
}

var getPathList = function (dir, ext) {
    var files = getList(dir, ext);
    var arr = [];
    files.forEach((file) => {
        arr.push({
            file
        });
    });
    return arr;
};

var getHashedPathList = function (dir, ext) {
    var files = getPathList(dir, ext);
    files.forEach((item) => {
        item.hash = crypto.createHash('md5').update(item.file).digest('hex');
    });
    return files;
};

var getHashedList = function (dir, ext) {
    var files = getHashedPathList(dir, ext);
    files.forEach((item) => {
        item.filename = path.basename(item.file);
        delete item.file;
    });
    return files;
};

var getPathByHash = function (dir, ext, hash) {
    var files = getHashedPathList(dir, ext);
    files = files.filter((item) => {
        return item.hash === hash;
    });
    return files[0].file;
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