const axios = require("axios");


const fetchApi = async () => {
  const mockData = {
    deliveryType: 0,
    storeId: 12,
    itemId: "",
    categoryIds: 1,
    type: 3,
    pn: 1,
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
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: process.env.MY_COOKIE // Add your cookie value here
    },
    params: {
      jsv: "2.7.1",
      appKey: "12574478",
      t: 1688216923826,
      sign: 'd4492b79a8a73d1a8efa24ed2df89469',
      api: "mtop.venus.shopcategoryservice.getcategorydetail",
      v: "1.1",
      type: "originaljson",
      dataType: "json",
      ecode: "1",
      SV: "5.0",
      data: JSON.stringify(mockData),
    }
  };
  const res = await axios.get(
    "https://waimai-guide.ele.me/h5/mtop.venus.shopcategoryservice.getcategorydetail/1.1/5.0/",
    axiosConfig
  );
  console.log('res.data :>> ', res.data);
}
fetchApi();