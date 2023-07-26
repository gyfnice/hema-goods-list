const axios = require('axios');
const _ = require('lodash');

const { replaceCookies } = require('@/utils/index.js');
const { setCookie } = require('@/auth.js');
const { updateCookie, getCookie } = require('@/connection/index.js');
const { getSignConfig, fetchLatLngByKeword } = require('@/api.js');

const coreUpdateCookie = async () => {
    let latestCookieStr = await getCookie();
    setCookie(latestCookieStr);
    const mockData = {
        extStatus: 0,
        netType: 0,
        isPage: false,
        cartFrom: 'eleme_newretail',
        exParams: JSON.stringify({
            version_newretail: '1.0.3',
            openNoApplyCouponQuery: true,
            storeId: '407216037',
            businessType: 0,
            giftInfo: {},
            cartFetchType: 'home',
            shippingFee: 700,
            takeoutPrice: 20,
            selfFetchPrice: 0,
            weightLimit: 20,
            packagingFee: 0.9,
            deviceId: '6AC390B27256480698D3540A7260BB2D|1688005162463',
            lat: 39.913234,
            lng: 116.477062,
            newUser: false,
            retailNewUser: false,
            shopNewUser: true,
            svpStatus: true,
            channel: 22,
            subChannel: 'ELE_APP',
            nrChannel: 'mobile.default.default',
            promiseTime: '',
            toastFilter: [],
            lastAddCartId: '',
            lastCheckCartId: '',
            sm_s_in_store: true,
            newStyle: 1,
            ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            isH5: true,
            wxAppId: '',
            appId: '',
            checkList: null,
            exchangeList: [],
            abFactorList: ['coupon_makeup_entry'],
            lastQryExt: {},
            pageType: 1,
            cartTab: '',
            queryFrom: '',
            autoShowCoudan: ''
        }),
        bizChannel: 'mobile.default.default',
        deviceId: '6AC390B27256480698D3540A7260BB2D|1688005162463',
        lat: 39.913234,
        lng: 116.477062
    };
    const axiosConfig = getSignConfig(mockData, {
        api: 'mtop.alsc.trade.query.bag'
    });
    const res = await axios.get(
        'https://alsc-buy2.ele.me/h5/mtop.alsc.trade.query.bag/5.0/5.0',
        axiosConfig
    );
    const cookies = res.headers['set-cookie'] || [];
    console.log('cookies :>> ', cookies);
    console.log('latestCookieStr :>> ', latestCookieStr);
    if (cookies.length > 1) {
        latestCookieStr = replaceCookies(cookies, latestCookieStr);
        await updateCookie(latestCookieStr);
    }
    return latestCookieStr;
};
const queryChannelStore = async ({ longitude, latitude, offset }) => {
    const mockData = {
        sceneCode: 'MINIAPP_ELEME_HOME_LIST',
        needReverseGeoAddress: 0,
        pageParams: JSON.stringify({
            offset,
            rankId: '',
            behavior: 'expose_list%24%24___click_list%24%24',
            queryParams: JSON.stringify({
                id: '',
                description: '',
                title: '附近推荐',
                tabName: '%E9%99%84%E8%BF%91%E6%8E%A8%E8%8D%90',
                pageCode: 'MINIAPP_ELEME_HOME_LIST',
                pageType: '',
                clickAfterColor: '#00a6ff',
                clickBeforeColor: '#333',
                fontWeight: 'bold',
                listType: '',
                position: 1,
                scrollTop: 0,
                tabCode: 'recommend_tab'
            }),
            limit: 10,
            scene: 'miniapp:homepage'
        }),
        longitude,
        latitude
        // longitude: 116.477062,
        // latitude: 39.913234
    };
    const axiosConfig = getSignConfig(mockData, {
        api: 'mtop.alsc.eleme.miniapp.homepagev1',
        timeout: 10000,
        needLogin: true,
        mainDomain: 'ele.me',
        subDomain: 'waimai-guide',
        H5Request: true,
        ttid: 'h5@safari_ios_604.1'
    });
    const res = await axios.get(
        'https://waimai-guide.ele.me/h5/mtop.alsc.eleme.miniapp.homepagev1/1.0/5.0',
        axiosConfig
    );
    const queue = [];
    const list =
        res.data?.data?.data?.frontend_page_shop_list_recommend?.fields
            ?.items || [];
    _.map(list, (item) => {
        const info = item?.fields?.restaurant || {};
        queue.push(info);
    });
    return queue;
};
const queryAllTaskStore = async (params) => {
    const curInfo = await fetchLatLngByKeword(params);
    const sendTask = new Array(15);
    const queue = [];
    const resList = await Promise.allSettled(
        _.map(sendTask, (kwKey, index) => {
            const offset = 0 + index * 10;
            return queryChannelStore({ ...curInfo, offset });
        })
    );
    _.map(resList, (item) => {
        _.map(item.value, (info) => {
            if (info?.scheme?.indexOf('store_id') > -1) {
                info.text = info.name;
                info.descs = info.shopTags.concat(info.supportTags);
                queue.push(info);
            }
        });
    });
    const sortList = _.sortBy(_.uniqBy(queue, 'storeId'), [
        function (food) {
            return food.recentOrderNum || 0;
        }
    ]);
    return _.reverse(sortList);
};
const queryGoodsByStore = async ({ storeId, keyword }) => {
    const mockData = {
        storeId,
        keyword,
        //storeId: 239354227,
        //keyword: '麒麟西瓜',
        rn: 50,
        pn: 1,
        type: 1,
        sortBy: 'default',
        deviceId: '6AC390B27256480698D3540A7260BB2D|1688005162463',
        isChangeSortType: 0,
        deliveryType: 0,
        rankId: '',
        menuFilter: '',
        shop_id: '239354227',
        channel: 22,
        subChannel: 'ELE_APP',
        bizChannel: 'mobile.default.default'
        // lat: 39.91179,
        // lng: 116.47697
    };
    const axiosConfig = getSignConfig(mockData, {
        api: 'mtop.venus.ShopSearchService.getSearchResult'
    });
    const res = await axios.get(
        'https://waimai-guide.ele.me/h5/mtop.venus.shopsearchservice.getsearchresult/1.1/5.0',
        axiosConfig
    );
    const skuList = res.data?.data?.data?.skuList || [];
    return skuList;
};
const queryRelativeGoods = async (params) => {
    const queue = [];
    const list = await queryAllTaskStore(params);
    const resList = await Promise.allSettled(
        _.map(list, (item, index) => {
            console.log('item.storeId :>> ', item.storeId);
            return queryGoodsByStore({
                storeId: item.storeId,
                keyword: params.goodsKeyword
            });
        })
    );
    _.map(resList, (item) => {
        _.map(item.value, (info) => {
            queue.push(info);
        });
    });
    return queue;
};

module.exports = {
    queryChannelStore,
    queryGoodsByStore,
    queryAllTaskStore,
    coreUpdateCookie,
    queryRelativeGoods
    //queryAddressList
};
