let Cookie = '';

const fs = require('fs');
const path = require('path');

const getCookie = () => {
    return Cookie || process.env.MY_COOKIE;
};
const setCookie = (val) => {
    Cookie = val;
};
// File paths
const fileCookiePath = path.join(__dirname, 'temp_data/core.cookie');

const getCookieFile = () => {
    // Read file content
    const content = fs.readFileSync(fileCookiePath, {
        encoding: 'utf8'
    });
    return content;
};
const setCookieFile = (val) => {
    try {
        fs.writeFileSync(fileCookiePath, val, {
            encoding: 'utf8'
        });
    } catch (err) {
        console.error('Error writing file:', err);
        throw err;
    }
};
module.exports = {
    getCookie,
    setCookie,
    getCookieFile,
    setCookieFile
};
