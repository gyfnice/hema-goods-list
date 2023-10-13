import axios from 'axios';
import storeTime from '@/utils/localTime.js';
import { cacheTimeApi } from '@/helper/index.js';
import { Store, getUrlParamValue } from '@/utils/index.js';
// Set default headers (e.g., for authentication)
const sign = getUrlParamValue('sign') || Store('signSuperKey');
if (sign) {
    Store('signSuperKey', sign);
}
axios.defaults.headers.common['Authorization'] = sign;

// import { goodsList, storeGoodsList } from '@/mockData/goodsList.js';

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
    if (storeIds.length > 0 && !storeTime.get('recordStoreId').value) {
        const res = await axios.get(`/api/hema/recordCollectStore`, {
            params: {
                storeIds: storeIds.join(',')
            }
        });
        if (res.data.state === 200) {
            storeTime.set(
                'recordStoreId',
                JSON.stringify(res.data.allGoods),
                Date.now() + 43200000
            );
            return res.data.allGoods;
        }
        return [];
    }
    return JSON.parse(storeTime.get('recordStoreId').value || '[]');
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
    // return mockResonse(storeGoodsList);
    return axios.get(`/api/hema/queryStoreInGoods`, {
        params
    });
};
export const getGoodsListByServer = async (params) => {
    const res = await cacheTimeApi({
        cacheKey: `${params.storeId}-goods-list`,
        seconds: 10 * 60,
        callback: () => {
            return axios.get(`/api/hema/goodsList`, {
                params
            });
        }
    });
    return res;
};

export const queryStoreListByAddress = async (params) => {
    // return mockResonse(storeGoodsList);
    const { lat, keyword } = params;
    const nameSpace = `${lat}_${keyword}-search`;
    const res = await cacheTimeApi({
        cacheKey: nameSpace,
        seconds: 5 * 60,
        callback: () => {
            return axios.get(`/api/hema/queryAddress`, {
                params
            });
        }
    });
    return res;
};

export const sendAuthCookie = (params) => {
    return axios.get(`/api/hema/setAuth`, {
        params
    });
};
export const queryAuthCookie = () => {
    return axios.get(`/api/hema/queryToken`);
};
