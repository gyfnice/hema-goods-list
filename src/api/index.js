import axios from 'axios';
import storeTime from '@/utils/localTime.js';
import { Store } from '@/utils/index.js';

// import { goodsList } from '@/mockData/goodsList.js';
const mapList = {};
const mockResonse = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                data
            });
        }, 600);
    });
};

export const recordCollectStore = async () => {
    const storeIds = (Store('historyList') || [])
        .filter((item) => item.collected)
        .map((item) => {
            return item.storeId;
        });
    if (
        storeIds.length > 0 &&
        storeTime.get('recordStoreId').value !== 'hasRecordToday'
    ) {
        const res = await axios.get(`/api/hema/recordCollectStore`, {
            params: {
                storeIds: storeIds.join(',')
            }
        });
        console.log('res :>> ', res);
        if (res.data.state === 200) {
            storeTime.set(
                'recordStoreId',
                'hasRecordToday',
                Date.now() + 43200000
            );
        }
    }
};
export const queryGoodsPriceHistory = (params) => {
    return axios.get(`/api/hema/queryGoodsPriceHistory`, {
        params
    });
};

export const updateAuthCookie = (params) => {
    return axios.get(`/api/hema/auto_query_cookie`, {
        params
    });
};
export const queryGoodsByStore = (params) => {
    return axios.get(`/api/hema/queryStoreInGoods`, {
        params
    });
};
export const getGoodsListByServer = (params) => {
    // return mockResonse(goodsList);
    return axios.get(`/api/hema/goodsList`, {
        params
    });
};

export const queryStoreListByAddress = (params) => {
    const { lat, keyword } = params;
    const nameSpace = `${lat}_${keyword}`;
    const curList = mapList[nameSpace];
    if (!curList) {
        return axios
            .get(`/api/hema/queryAddress`, {
                params
            })
            .then((res) => {
                if (res.data.list.length > 0) {
                    mapList[nameSpace] = res;
                }
                return res;
            });
    }
    return curList;
};

export const sendAuthCookie = (params) => {
    return axios.get(`/api/hema/setAuth`, {
        params
    });
};
export const queryAuthCookie = () => {
    return axios.get(`/api/hema/queryToken`);
};
