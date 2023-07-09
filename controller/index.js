const axios = require("axios");
const _ = require("lodash");

const { getSignConfig } = require("@/api.js");

const queryChannelStore = async () => {
  const mockData = {
    sceneCode: "MINIAPP_ELEME_HOME_LIST",
    needReverseGeoAddress: 0,
    pageParams: JSON.stringify({
      offset: 0,
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
    longitude: 116.477062,
    latitude: 39.913234
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
    queue.push(info.name);
  })
  return queue;
};
const queryAddressList = () => {};

module.exports = {
  queryChannelStore,
  queryAddressList
};
