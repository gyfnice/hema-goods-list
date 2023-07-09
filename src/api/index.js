import axios from "axios";

const mapList = {};
export const getGoodsListByServer = (params) => {
  return axios.get(`/api/hema/goodsList`, {
    params
  });
}

export const queryStoreListByAddress = (params) => {
  const { lat, keyword } = params;
  const nameSpace = `${lat}_${keyword}`;
  const curList = mapList[nameSpace];
  if(!curList) {
    return axios.get(`/api/hema/queryAddress`, {
      params
    }).then(res => {
      if(res.data.list.length > 0) {
        mapList[nameSpace] = res;
      }
      return res;
    });
  }
  return curList;
}

export const sendAuthCookie = (params) => {
  return axios.get(`/api/hema/setAuth`, {
    params
  });
};
export const queryAuthCookie = () => {
  return axios.get(`/api/hema/queryToken`);
};
