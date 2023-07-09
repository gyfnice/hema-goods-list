const axios = require("axios");
const _ = require("lodash");

const { getCookie } = require("@/auth.js");
const { getSignConfig, fetchLatLngByKeword } = require("@/api.js");

const queryChannelStore = async ({ longitude, latitude, offset }) => {
  const mockData = {
    sceneCode: "MINIAPP_ELEME_HOME_LIST",
    needReverseGeoAddress: 0,
    pageParams: JSON.stringify({
      offset,
      rankId: "",
      behavior: "expose_list%24%24___click_list%24%24",
      queryParams: JSON.stringify({
        id: "",
        description: "",
        title: "附近推荐",
        tabName: "%E9%99%84%E8%BF%91%E6%8E%A8%E8%8D%90",
        pageCode: "MINIAPP_ELEME_HOME_LIST",
        pageType: "",
        clickAfterColor: "#00a6ff",
        clickBeforeColor: "#333",
        fontWeight: "bold",
        listType: "",
        position: 1,
        scrollTop: 0,
        tabCode: "recommend_tab"
      }),
      limit: 10,
      scene: "miniapp:homepage"
    }),
    longitude,
    latitude
    // longitude: 116.477062,
    // latitude: 39.913234
  };
  const axiosConfig = getSignConfig(mockData, {
    api: "mtop.alsc.eleme.miniapp.homepagev1",
    timeout: 10000,
    needLogin: true,
    mainDomain: "ele.me",
    subDomain: "waimai-guide",
    H5Request: true,
    ttid: "h5@safari_ios_604.1"
  });
  const res = await axios.get(
    "https://waimai-guide.ele.me/h5/mtop.alsc.eleme.miniapp.homepagev1/1.0/5.0",
    axiosConfig
  );
  const queue = []
  const list = res.data?.data?.data?.frontend_page_shop_list_recommend?.fields?.items || []
  _.map(list, (item) => {
    const info = item?.fields?.restaurant || {};
    queue.push(info);
  })
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
      if (info?.scheme?.indexOf("store_id") > -1) {
        info.text = info.name;
        info.descs = info.shopTags.concat(info.supportTags);
        queue.push(info);
      };
    });
  });
  const sortList = _.sortBy(_.uniqBy(queue, "storeId"), [
    function (food) {
      return food.recentOrderNum || 0;
    }
  ]);
  return _.reverse(sortList);
};
const queryAddressList = () => {};

module.exports = {
  queryChannelStore,
  queryAllTaskStore,
  queryAddressList
};
