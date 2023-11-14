const fs = require('fs');
const path = require('path');

function readDirRecursiveSync(dir) {
    const files = fs.readdirSync(dir);
    let fileList = [];

    files.forEach(function (file) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            fileList = fileList.concat(readDirRecursiveSync(filePath));
        } else {
            console.log('filePath :>> ', filePath);
            fileList.push(filePath.replace(dir, ''));
        }
    });

    return fileList;
}

module.exports = {
    readDirRecursiveSync
};
