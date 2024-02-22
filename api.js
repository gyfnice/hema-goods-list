const async = require('async');
const axios = require('axios');
const _ = require('lodash');

const {
    storeDataOnRedis,
    getDataByKey
} = require('@/controller/fetchDataFromMemory.js');

const { getCookie } = require('./auth.js');
const { getSign } = require('./sign.js');

const getSignConfig = (mockData, extendParams, extendHeaders = {}) => {
    const time = new Date().getTime();
    const inputData = JSON.stringify(mockData);
    const sign = getSign(inputData, time);
    const axiosConfig = {
        headers: {
            ...extendHeaders,
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: getCookie() // Add your cookie value here
        },
        params: {
            jsv: '2.7.1',
            appKey: '12574478',
            t: time,
            sign,
            v: '1.1',
            type: 'originaljson',
            dataType: 'json',
            SV: '5.0',
            data: inputData,
            ...extendParams
        }
    };
    return axiosConfig;
};
async function fetchLatLngByKeword({ keyword, lat, lng }) {
    const mockData = {
        keyword,
        offset: 0,
        limit: 40,
        latitude: lat,
        longitude: lng
    };
    // Axios request configuration
    const axiosConfig = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cookie: getCookie() // Add your cookie value here
        },
        params: mockData
    };
    // Make an HTTPS GET request using Axios
    const res = await axios.get(
        'https://h5.ele.me/restapi/bgs/poi/search_poi_nearby',
        axiosConfig
    );
    const curInfo = {
        latitude: res?.data?.[0]?.latitude || 40.0708,
        longitude: res?.data?.[0]?.longitude || 116.336116
    };
    return curInfo;
}
async function getHotGoodsList({ storeId, pn = 1 }) {
    const mockData = {
        storeId,
        moduleId: '-1',
        moduleType: '-1',
        pn,
        rn: 20,
        deliveryType: 0,
        scentExtend:
            '{"SHOW_PRIVILEGES_AND_DISCOUNTS_ACTIVITY_CARD":true, "FROM_CHANNEL":"emallv2","businessComeFrom":""}',
        channel: 22,
        subChannel: 'ELE_APP',
        bizChannel: 'mobile.default.default',
        deviceId: '6AC390B27256480698D3540A7260BB2D|1688005162463',
        lat: 40.067532,
        lng: 116.333729
    };
    const axiosConfig = getSignConfig(mockData, {
        api: 'mtop.venus.flashsaleshoptabservice.queryshoptab',
        ecode: '1'
    });
    const res = await axios.get(
        'https://waimai-guide.ele.me/h5/mtop.venus.flashsaleshoptabservice.queryshoptab/1.1/5.0/',
        axiosConfig
    );
    if (res?.data?.ret?.[0]?.indexOf('FAIL_') > -1) {
        return {
            code: 401,
            message: res?.data?.ret?.[0] || 'cookie过期'
        };
    }
    const list = res.data?.data?.data?.[0]?.shopTabDataDTO?.itemList || [];
    return list;
}
async function getGoodsList({ storeId, pn = 1, categoryIds }) {
    const mockData = {
        deliveryType: 0,
        storeId,
        itemId: '',
        categoryIds,
        type: 3,
        pn,
        rn: 40,
        sortBy: 'default',
        isSupportRank: false,
        channel: 22,
        subChannel: 'ELE_APP',
        bizChannel: 'mobile.default.default',
        deviceId: '965C75F857BA4721977A8DA686DD57DD|1687847275310',
        lat: 39.913234,
        lng: 116.477062
    };
    console.log('list-storeId :>> ', storeId);
    const axiosConfig = getSignConfig(mockData, {
        api: 'mtop.venus.shopcategoryservice.getcategorydetail',
        ecode: '1'
    });
    // Make an HTTPS GET request using Axios
    const res = await axios.get(
        'https://waimai-guide.ele.me/h5/mtop.venus.shopcategoryservice.getcategorydetail/1.1/5.0/',
        axiosConfig
    );
    if (!res.data.data.data) {
        // console.log('res.data :>> ', res.data);
    }
    const list = res?.data?.data?.data?.[0]?.foods || [];
    return [...list];
}
const scoreSort = (food) => {
    const diffPrice = Number(food.originalPrice) - Number(food.currentPrice);
    let bonusScore = (diffPrice / food.originalPrice) * 100;
    if (bonusScore < 0) {
        bonusScore = 0;
    }
    let monthSell = Math.sqrt(food.monthSell || 0.5);
    if (food?.name?.indexOf?.('德青源') > -1) {
        monthSell = monthSell * 2 + diffPrice;
    }
    return bonusScore + monthSell;
};
async function run(storeId) {
    const storeIdKey = `ele_${storeId}`;
    const list = await getDataByKey(storeIdKey);
    return list || [];
}
const whiteList = ['盒马', '正大优鲜', '永辉超市', '京客隆', '物美', '超市'];
const requestByLngLat = async ({ curInfo, kw }) => {
    const addressConfig = getSignConfig(
        {
            appId: '28820',
            instance: 'INNER',
            type: 'originaljson',
            params: JSON.stringify({
                appId: '28820',
                _input_charset: 'UTF-8',
                _output_charset: 'UTF-8',
                gatewayApiType: 'mtop',
                'x-ele-scene': 'search_suggest',
                mtop_api_version: '1.0',
                isMtopMiniApp: true,
                userId: '1497914586',
                latitude: curInfo.latitude,
                longitude: curInfo.longitude,
                kw: kw,
                scene: 'ALIPAY_MINIAPP_SUGGEST',
                apiVersion: '2.2',
                recKw: kw,
                needRecWords: true
            })
        },
        {
            api: 'mtop.relationrecommend.TinyAppRecommend.recommend',
            timeout: 10000,
            needLogin: true,
            mainDomain: 'ele.me',
            subDomain: 'waimai-guide',
            H5Request: true,
            ttid: 'h5@safari_ios_604.1'
        }
    );
    const res = await axios.get(
        'https://waimai-guide.ele.me/h5/mtop.relationrecommend.tinyapprecommend.recommend/1.0/5.0/',
        addressConfig
    );
    if (kw === '超市') {
        return res?.data?.data?.result?.[0]?.cards || [];
    }
    return (
        _.find(res?.data?.data?.result?.[0]?.cards, function (o) {
            return (
                o?.content?.scheme && o?.content?.text?.indexOf?.('代购') === -1
            );
        })?.content || {}
    );
};
async function queryAddress(params) {
    const curInfo = await fetchLatLngByKeword(params);
    const resList = await Promise.allSettled(
        _.map(whiteList, (kwKey) => {
            return requestByLngLat({ curInfo, kw: kwKey });
        })
    );
    const queue = [];
    _.map(resList, (list) => {
        if (!Array.isArray(list.value)) {
            queue.push(list.value);
            return;
        }
        list.value
            .filter((item) => item?.content?.scheme)
            .map((item) => {
                queue.push(item.content);
            });
    });
    return _.uniqBy(queue, 'text').filter((item) => item?.text);
}
module.exports = {
    run,
    getSignConfig,
    fetchLatLngByKeword,
    requestByLngLat,
    getHotGoodsList,
    queryAddress
};
