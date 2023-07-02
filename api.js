const async = require("async");
const axios = require("axios");
const _ = require("lodash");

const { getSign } = require("./sign.js");

async function getGoodsList({ storeId, pn = 1, categoryIds }) {
  const mockData = {
    deliveryType: 0,
    storeId,
    itemId: "",
    categoryIds,
    type: 3,
    pn,
    rn: 40,
    sortBy: "default",
    isSupportRank: false,
    channel: 22,
    subChannel: "ELE_APP",
    bizChannel: "mobile.default.default",
    deviceId: "965C75F857BA4721977A8DA686DD57DD|1687847275310",
    lat: 39.913234,
    lng: 116.477062
  };
  const time = new Date().getTime();
  const inputData = JSON.stringify(mockData);
  const sign = getSign(inputData, time);
  // Axios request configuration
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: process.env.MY_COOKIE // Add your cookie value here
    },
    params: {
      jsv: "2.7.1",
      appKey: "12574478",
      t: time,
      sign,
      api: "mtop.venus.shopcategoryservice.getcategorydetail",
      v: "1.1",
      type: "originaljson",
      dataType: "json",
      ecode: "1",
      SV: "5.0",
      data: inputData
    }
  };
  // Make an HTTPS GET request using Axios
  const res = await axios.get(
    "https://waimai-guide.ele.me/h5/mtop.venus.shopcategoryservice.getcategorydetail/1.1/5.0/",
    axiosConfig
  );
  if(!res.data.data.data) {
    console.log('res.data :>> ', res.data);
  }
  const list = res.data.data.data[0].foods;
  return [...list];
}
const scoreSort = (food) => {
  const diffPrice = Number(food.originalPrice) - Number(food.currentPrice);
  let bonusScore = diffPrice / food.originalPrice * 100;
  if(bonusScore < 0) {
    bonusScore = 0;
  }
  return bonusScore + Math.sqrt(food.monthSell || 0.5);
}
async function run(storeId) {
  const bigTask = new Array(2);
  const task = new Array(10);
  const bigCouponTask = _.map(bigTask, (item, index) => {
    const taskId = index + 1;
    return getGoodsList({
      storeId,
      pn: taskId,
      categoryIds: '["t_b_tab"]'
    });
  });
  const couponTask = _.map(task, (item, index) => {
    const taskId = index + 1;
    return getGoodsList({
      storeId, // 239354227/小营店  239335304/水贝店 239342276/国贸
      // 407216037/正大国贸  369687486/正大昌平
      pn: taskId,
      categoryIds: '["1"]'
    });
  });
  const queue = [];
  const res = await Promise.allSettled([...bigCouponTask, ...couponTask])
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
  /* _.map(list, (item) => {
      console.log(
        "item.name :>> ",
        item.name,
        `${item.currentPrice}元-原价${item.originalPrice}-月销量${
          item.monthSell
        }-库存${item.realLeftNum}-叠加优惠:${item?.couponTag?.actDesc || "无"}`
      );
    }); */
  return _.reverse(list);
}
module.exports = {
  run
};
