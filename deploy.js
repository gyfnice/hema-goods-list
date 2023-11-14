const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const { readDirRecursiveSync } = require('./helper/file.js');
const upload = require('./controller/uploadFile.js');
const files = readDirRecursiveSync('dist/assets/');

const uploadFile = async (fileName, token) => {
    const fileBinary = fs.readFileSync(`dist/assets/${fileName}`);
    console.log('token :>> ', token);
    const param = new FormData();
    param.append('chunk', '0'); //断点传输
    param.append('chunks', '1');
    param.append('file', fileBinary, fileName);
    param.append('token', token);
    param.append('key', 'h5/proele/' + fileName);
    //formData['key'] = 'wxmp/record/' + fileName;
    try {
        await axios.post('https://upload-z1.qiniup.com/', param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (err) {
        console.log('error', fileName);
    }
    //console.log('response?.data :>> ', response?.data);
};
const uploadCdn = async () => {
    const token = await upload.queryTokenV2();
    for (const file of files) {
        uploadFile(file, token);
    }
};
uploadCdn();
