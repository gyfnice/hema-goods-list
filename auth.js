let Cookie = '';

const fs = require('fs');
const path = require('path');

const getCookie = () => {
    return Cookie || process.env.MY_COOKIE;
};
const setCookie = (val) => {
    Cookie = val;
};

const getCookieFile = () => {
    return '';
};
const setCookieFile = (val) => {
};
module.exports = {
    getCookie,
    setCookie,
    getCookieFile,
    setCookieFile
};
