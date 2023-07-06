import axios from "axios";

export const getGoodsListByServer = (params) => {
  return axios.get(`/api/hema/goodsList`, {
    params
  });
}

export const queryStoreListByAddress = (params) => {
  return axios.get(`/api/hema/queryAddress`, {
    params
  });
}