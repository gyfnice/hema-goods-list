const axios = require('axios');
var FormData = require('form-data');

const queryToken = async () => {
    const axiosConfig = {
        headers: {
            Accept: 'application/json',
            ticket: 'ignore',
            authorization: 'ignore',
            referer: 'https://yjadmin.youjiajk.com/saas/'
        }
    };
    const res = await axios.get(
        'https://yjadmin.youjiajk.com/api/uplus/weChat/qiniu/token',
        axiosConfig
    );
    return res.data.data;
};
const queryTokenV2 = async (fileName = undefined) => {
    const axiosConfig = {
        headers: {
            Accept: 'application/json',
            ticket: 'ignore',
            authorization: 'ignore'
        }
    };
    const res = await axios.post(
        'https://storage-service-web.youjiajk.com/file/token',
        { fileName },
        axiosConfig
    );
    return res.data.data;
};
module.exports = {
    queryToken,
    queryTokenV2
};
