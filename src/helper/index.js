import storeTime from '@/utils/localTime.js';

export const cacheTimeApi = async ({ cacheKey, seconds, callback }) => {
    const cacheData = storeTime.get(cacheKey).value;
    if (cacheData) {
        return JSON.parse(cacheData);
    }
    // return mockResonse(goodsList);
    const res = await callback();
    storeTime.set(cacheKey, JSON.stringify(res), Date.now() + seconds * 1000);
    return res;
};
