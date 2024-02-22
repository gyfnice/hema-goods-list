const queryHotShopGoods = async ({ storeId, pn }) => {
    const mockData = {
        deliveryType: 0,
        scentExtend: '{"businessComeFrom":""}',
        storeId,
        moduleId: '-1',
        moduleType: '-1',
        channel: 22,
        subChannel: 'ELE_APP',
        rankId: 'wx4g49b6AC390B27256480698D3540A7260BB2D|1688005162463_06d1181ff5fe27e1573c1856b828e72f170850245',
        pn,
        rn: 20,
        bizChannel: 'mobile.default.default',
        deviceId: '6AC390B27256480698D3540A7260BB2D|1688005162463',
        lat: 39.913234,
        lng: 116.477062
    };
    const res = await r.default.request({
        api: 'mtop.venus.FlashSaleShopTabService.queryShopTab',
        v: '1.1',
        host: 'waimai-guide.ele.me',
        data: mockData
    });
    const list = res.data?.data?.[0]?.shopTabDataDTO?.itemList || [];
    //console.log('spec.hot-list :>> ', list);
    return list;
};
const getGoodsList = async ({ storeId, pn, categoryIds, type }) => {
    const mockData = {
        deliveryType: 0,
        storeId,
        itemId: '',
        categoryIds,
        type,
        pn,
        rn: 20,
        sortBy: 'default',
        isSupportRank: false,
        isAllCategroy: 0,
        scentExtend: '{"FROM_CHANNEL":"emallv2","businessComeFrom":""}',
        channel: 22,
        subChannel: 'ELE_APP'
    };
    const res = await r.default.request({
        api: 'mtop.venus.shopcategoryservice.getcategorydetail',
        v: '1.1',
        host: 'waimai-guide.ele.me',
        data: mockData
    });
    const list = res?.data?.data?.[0]?.foods || [];
    //console.log('spec.goods.list :>> ', list);
    return [...list];
};
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
const run = async ({ storeId }) => {
    const hotTask = new Array(20); // 本地max:30
    const bigTask = new Array(5);
    const task = new Array(30); // 本地max:30
    const hotHomeTask = _.map(hotTask, (item, index) => {
        const taskId = index + 1;
        return queryHotShopGoods({
            storeId,
            pn: taskId
        });
    });
    const bigCouponTask = _.map(bigTask, (item, index) => {
        const taskId = index + 1;
        return getGoodsList({
            storeId,
            pn: taskId,
            categoryIds: '["recommend_sub_1"]',
            type: 17
        });
    });
    const couponTask = _.map(task, (item, index) => {
        const taskId = index + 1;
        return getGoodsList({
            storeId,
            pn: taskId,
            categoryIds: '["1"]',
            type: 3
        });
    });
    const queue = [];
    const res = await Promise.allSettled([
        ...hotHomeTask,
        ...bigCouponTask,
        ...couponTask
    ]);
    _.map(res, (list) => {
        _.map(list.value, (food) => {
            food.priceSortWeight = scoreSort(food);
            queue.push(food);
        });
    });
    const list = _.sortBy(queue, [
        function (food) {
            return food.priceSortWeight;
        }
    ]);
    const goodsData = _.uniqBy(_.reverse(list), 'name');
    console.log('spec.list :>> ', goodsData);
    fetch('https://waimai-guide.ele.me/h5/api/hema/storeGoodsByStoreId', {
        method: 'POST',
        body: JSON.stringify({ list: goodsData, storeId: '12334' }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return goodsData;
};
const runStoreListTask = async () => {
    const res = await fetch(
        'https://waimai-guide.ele.me/h5/api/hema/queryStoreFromRedis',
        {
            method: 'POST',
            body: JSON.stringify({ type: 'storeList' }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    const data = await res.json();
    const storeMapInfo = data?.info || {};
    let allStoreIds = [];
    _.keys(storeMapInfo).map((nameSpace) => {
        const list = storeMapInfo[nameSpace];
        const storeIds = list.map((item) => item.storeId);
        allStoreIds = [...allStoreIds, ...storeIds];
    });
    Promise.allSettled(
        allStoreIds.map((storeId) => {
            return run({ storeId });
        })
    );
};
runStoreListTask();
