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
const { run, queryAddress, requestByLngLat } = require('@/api.js');
//const { updateCookie, getCookie } = require('@/connection/index.js');
const { getCookieFile, setCookieFile } = require('@/auth.js');
const {
    recordPriceByStoreId,
    fetchGoodsPriceRecord,
    queryMonthSellData
} = require('@/controller/handleData.js');

const mockGoodsList = require('@/data/goodsList.json');

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
        await recordPriceByStoreId({ goodsData: list || [], storeId });
        return list?.slice(0, 60);
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
        console.log('res :>> ', res);
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
    recordPriceByStoreId({ goodsData: list || [], storeId });
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
