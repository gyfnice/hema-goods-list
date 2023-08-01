import { createStore } from 'vuex';
import { showToast } from 'vant';

import { queryGoodsPriceHistory } from '@/api/index.js';
import { Store } from '@/utils/index.js';

function getStoreId(url) {
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('store_id');
}
export const store = createStore({
    state() {
        return {
            photos: [],
            queryParams: {},
            searchAddress: Store('searchAddress') || '',
            currentCity: Store('currentCity') || '北京',
            currentGoodsItem: {},
            showPhoto: false,
            lineShow: false,
            lineGoodsItem: {},
            lineLoading: false,
            lineDataMap: {},
            lineData: [],
            currentStoreItem: Store('currentStoreItem') || {
                scheme: 'https://h5.ele.me/newretail/p/emall-shop/?store_id=239354227&shop_type=emall&hideNavbar=1&geolat=40.0708&geolng=116.336116&fetchType=0',
                text: '盒马鲜生(国贸)'
            },
            selectedHistoryAddress: Store('selectedHistoryAddress') || [],
            historyList: []
        };
    },
    mutations: {
        saveSearchAddress(state) {
            state.selectedHistoryAddress.push({
                city: state.currentCity,
                address: state.searchAddress
            });
            state.selectedHistoryAddress = _.uniqBy(
                state.selectedHistoryAddress,
                'address'
            );
            Store('selectedHistoryAddress', state.selectedHistoryAddress);
        },
        selectCity(state, cityName) {
            state.currentCity = cityName;
            Store('currentCity', cityName);
        },
        changeAddress(state, val) {
            state.searchAddress = val;
            Store('searchAddress', val);
        },
        hideLineModal(state) {
            state.lineShow = false;
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
            Store('currentStoreItem', item);
        },
        SET_QUERY_PARAMS(state, query) {
            state.queryParams = query || {};
        }
    },
    actions: {
        fetchQueryParams({ commit }, queryParams) {
            commit('SET_QUERY_PARAMS', queryParams);
        },
        async fetchGoodsLineChart({ state }, item) {
            const lineKey = `${item.storeId}_${item.name}`;
            state.lineShow = true;
            state.lineGoodsItem = {
                ...item
            };
            state.lineData = [];
            if (
                state.lineDataMap[lineKey] &&
                state.lineDataMap[lineKey].length > 0
            ) {
                state.lineData = [...state.lineDataMap[lineKey]];
                return;
            }
            if (!state.lineDataMap[lineKey]) {
                state.lineDataMap[lineKey] = [];
            }
            try {
                state.lineLoading = true;
                const res = await queryGoodsPriceHistory({
                    storeId: item.storeId,
                    name: item.name
                });
                if (res?.data?.list?.length <= 1) {
                    showToast('该商品暂无趋势图');
                    state.lineShow = false;
                }
                state.lineDataMap[lineKey] = res?.data?.list || [];
                state.lineData = [...state.lineDataMap[lineKey]];
                state.lineLoading = false;
            } catch (res) {
                state.lineData = [];
                state.lineLoading = false;
            }
        },
        decrement(context) {
            context.commit('decrement');
        }
    },
    getters: {
        currentStoreId(state) {
            const storeId =
                state?.queryParams?.storeId ||
                state.currentStoreItem?.storeId ||
                getStoreId(state.currentStoreItem.scheme);
            if (state?.queryParams?.storeId) {
                state.currentStoreItem.text = state?.queryParams?.storeName;
            }
            return storeId;
        }
    }
});
