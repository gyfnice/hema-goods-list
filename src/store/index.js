import { createStore } from "vuex";

import { Store } from "@/utils/index.js";

function getStoreId(url) {
  const params = new URLSearchParams(url.split('?')[1]);
  return params.get('store_id');
}
export const store = createStore({
  state() {
    return {
      photos: [],
      searchAddress: "",
      currentCity: "北京",
      currentGoodsItem: {},
      showPhoto: false,
      currentStoreItem: Store("currentStoreItem") || {
        scheme:
          "https://h5.ele.me/newretail/p/emall-shop/?store_id=239354227&shop_type=emall&hideNavbar=1&geolat=40.0708&geolng=116.336116&fetchType=0",
        text: "盒马鲜生(国贸)"
      },
      historyList: []
    };
  },
  mutations: {
    selectCity(state, cityName) {
      state.currentCity = cityName;
    },
    changeAddress(state, val) {
      state.searchAddress = val;
    },
    hidePhotoModal(state) {
      state.showPhoto = false;
    },
    select_photo(state, item) {
      state.currentGoodsItem = item;
      state.photos = item.photos;
      state.showPhoto = true;
    },
    select_store_id(state, item) {
      state.currentStoreItem = item;
      Store("currentStoreItem", item);
    }
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
    decrement(context) {
      context.commit("decrement");
    }
  },
  getters: {
    currentStoreId(state) {
      const storeId = getStoreId(state.currentStoreItem.scheme);
      return storeId;
    }
  }
});