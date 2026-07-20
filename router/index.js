const koa_router = require('koa-router');
const router = koa_router();
const _ = require('lodash');

const {
    queryChannelStore,
    queryAllTaskStore,
    queryGoodsByStore,
    queryRelativeGoods,
    coreUpdateCookie
} = require('@/controller/index.js');
const {
    storeDataOnRedis,
    getDataByKey
} = require('@/controller/fetchDataFromMemory.js');
const { run, queryAddress, requestByLngLat } = require('@/api.js');
//const { updateCookie, getCookie } = require('@/connection/index.js');
const { getCookieFile, setCookieFile } = require('@/auth.js');
const {
    recordPriceByStoreId,
    fetchGoodsPriceRecord,
    queryMonthSellData
} = require('@/controller/handleData.js');

const mockGoodsList = require('@/data/goodsList.json');

router.post('/api/hema/queryStoreFromRedis', async (context) => {
    const queryParams = context.request.body;
    const { type } = queryParams;
    let info = null;
    if (type === 'storeList') {
        info = await getDataByKey('ele_store_list_map');
    }
    context.response.body = {
        state: 1,
        info,
        msg: 'success'
    };
});
// 获取商品售卖数量
router.post('/api/hema/storeGoodsByStoreId', async (context) => {
    // context 上下文
    const queryParams = context.request.body;
    const { storeId, type, list, storeMap, storeName } = queryParams;
    const storeIdKey = `ele_${storeId}`;
    const storeMapKey = 'ele_store_list_map';
    let info = await getDataByKey(storeMapKey);
    if(!info) {
        info = {};
    }
    console.log('storeId, storeName :>> ', storeId, storeName);
    info[storeId] = storeName;
    storeDataOnRedis(storeMapKey, info);
    storeDataOnRedis(storeIdKey, list);
    context.response.body = {
        state: 1,
        msg: 'success'
    };
});
router.get('/api/hema/queryStoreList', async (context) => {
    let info = await getDataByKey('ele_store_list_map');
    context.response.body = {
        state: 1,
        info
    };
});
// 获取商品售卖数量
router.get('/api/hema/queryMonthSellData', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    //const list = await queryAddress(queryParams);
    const list = await queryMonthSellData(queryParams);
    context.response.body = {
        state: 1,
        list
    };
});
router.get('/api/hema/recordCollectStore', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    const storeIds = queryParams.storeIds.split(',');
    const handleStore = async (storeId) => {
        const list = await run(storeId);
        return list;
    };
    try {
        const rankList = await Promise.allSettled(
            storeIds.map((storeId) => {
                return handleStore(storeId);
            })
        );
        const allGoods = [];
        _.map(rankList, (item) => {
            _.map(item.value, (info) => {
                allGoods.push(info);
            });
        });
        const body = {
            state: 200,
            allGoods
        };
        context.response.body = body;
    } catch (res) {
        context.response.body = {
            state: 500
        };
    }
});
// 获取商品价格历史
router.get('/api/hema/queryGoodsPriceHistory', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    //const list = await queryAddress(queryParams);
    const list = await fetchGoodsPriceRecord(queryParams);
    context.response.body = {
        state: 1,
        list
    };
});
// 获取商品列表接口
router.get('/api/hema/goodsList', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    const storeId = queryParams.storeId;
    const list = await run(storeId);
    //recordPriceByStoreId({ goodsData: list || [], storeId });
    if (list?.code === 401) {
        context.response.body = {
            state: 401,
            message: list?.message
        };
        return;
    }
    context.response.body = {
        state: 1,
        list
    };
});
// 获取地址列表
router.get('/api/hema/queryAddress', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    //const list = await queryAddress(queryParams);
    const list = await queryAllTaskStore(queryParams);
    context.response.body = {
        state: 1,
        list
    };
});
// 通过store搜索商品信息
router.get('/api/hema/queryStoreInGoods', async (context) => {
    const queryParams = context.request.query;
    const list = await queryRelativeGoods(queryParams);
    context.response.body = {
        state: 1,
        list
    };
    //context.response.body = mockGoodsList;
});
// 测试搜索地址
router.get('/api/hema/queryStoreText', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    const res = await queryChannelStore();
    context.response.body = {
        state: 1,
        list: res
    };
});
// 定时更新cookie
router.get('/api/hema/auto_query_cookie', async (context) => {
    await coreUpdateCookie();
    context.response.body = {
        state: 1,
        list: []
    };
});
// 设置cookie
router.get('/api/hema/setAuth', async (context) => {
    // context 上下文
    const queryParams = context.request.query;
    setCookieFile(queryParams.authToken);
    context.response.body = {
        state: 'success'
    };
});
// 查看cookie
router.get('/api/hema/queryToken', async (context) => {
    // context 上下文
    const content = getCookieFile();
    context.response.body = {
        state: 'success',
        content
    };
});

module.exports = router;
