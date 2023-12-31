<template>
    <van-nav-bar
        @click-right="onClickRight"
        right-text="超市购物"
        @click-left="onClickLeft"
        title="附近超市比价"
        left-text="返回"
        left-arrow
    />
    <van-floating-bubble
        axis="xy"
        :offset="{ y: 500 }"
        icon="records"
        magnetic="x"
        @click="showGoodsRight = true"
    />
    <van-row>
        <van-col :span="24 - searchLen > 20 ? 20 : 24 - searchLen">
            <van-cell
                center
                @click="showRight = true"
                is-link
                :title="searchAddress || '请选择'"
            >
                <template #icon>
                    <van-icon name="location-o" />
                </template>
            </van-cell>
        </van-col>
        <van-col :span="searchLen">
            <van-search
                :disabled="searchAddress?.length === 0"
                v-model="keyword"
                placeholder="搜索商品名称"
            />
        </van-col>
    </van-row>
    <van-loading size="54" v-if="loading"> 商品加载中... </van-loading>
    <!-- <van-tree-select
        v-model:main-active-index="activeIndex"
        height="90vh"
        :groupItems="groupItems"
    >
        <template #content>
            <List :loading="loading" :list="filterCouponList" />
        </template>
    </van-tree-select> -->
    <van-collapse v-model="activeGroupIndex">
        <van-collapse-item
            v-for="(groupItem, index) in groupItems"
            :name="index"
        >
            <template #title>
                <StoreNameBar :item="groupItem || {}">
                    <van-tag plain type="primary">{{
                        groupItem.priceSortWeight.toFixed(2)
                    }}</van-tag>
                </StoreNameBar>
            </template>
            <List
                :loading="false"
                :list="
                    sortList(
                        goodsList.filter(
                            (item) => item.storeName === groupItem.text
                        )
                    )
                "
                :hasShopName="true"
            />
        </van-collapse-item>
    </van-collapse>
    <van-popup
        closeable
        v-model:show="showRight"
        position="bottom"
        :style="{ height: '50%', padding: '20px' }"
    >
        <div class="look-wrapper-content">
            <h4>选择比价区域</h4>
            <van-space direction="vertical" fill>
                <AddressSearch @hidePane="hidePane" :hasHistory="true" />
                <van-row>
                    <van-col span="16" offset="4"></van-col>
                    <van-col span="4">
                        <van-button
                            @click="showRight = false"
                            size="small"
                            type="primary"
                            >确认</van-button
                        >
                    </van-col>
                </van-row>
            </van-space>
        </div>
    </van-popup>
    <van-popup
        :style="{ width: '95%', height: '100%', padding: '20px' }"
        closeable
        v-model:show="showGoodsRight"
        position="right"
    >
        <div style="text-align: center; padding: 15px">
            <p>收藏对比商品栏</p>
            <List
                :loading="false"
                :list="cartsList"
                :hasShopName="true"
                :hasCartCompare="true"
            />
        </div>
    </van-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

import { useRouter } from 'vue-router';

import AddressSearch from '@/components/AddressSearch.vue';
import StoreNameBar from '@/components/UI/StoreNameBar.vue';

import List from '@/components/List.vue';
import { cityMapInfo } from '@/config/city.js';
import { queryGoodsByStore } from '@/api/index.js';

const router = useRouter();
const store = useStore();

const showRight = ref(false);
const showGoodsRight = ref(false);
const loading = ref(false);
const keyword = ref('');
const activeIndex = ref(0);
const activeGroupIndex = ref(['0']);

const searchGoods = async (value) => {
    if (!value || !value.trim()) {
        return;
    }
    const kword = value.trim();
    const info = cityMapInfo[currentCity.value];
    store.commit('saveSearchAddress');
    loading.value = true;
    try {
        const resData = await queryGoodsByStore({
            keyword: searchAddress.value,
            goodsKeyword: kword,
            lat: info.lat,
            lng: info.log
        });
        loading.value = false;
        store.commit('set_search_goods_list', resData?.data?.list || []);
    } catch (e) {
        loading.value = false;
    }
};
watch(
    () => keyword.value,
    _.debounce((value) => {
        searchGoods(value);
    }, 500)
);
const hidePane = () => {
    showRight.value = false;
    searchGoods(keyword.value);
};
const sortList = (list) => {
    return _.reverse(
        _.sortBy(list, [
            function (food) {
                return food.scoreWeight;
            }
        ])
    );
};
const scoreSort = (food) => {
    const diffPrice = Number(food.originalPrice) - Number(food.currentPrice);
    let bonusScore = (diffPrice / food.originalPrice) * 100;
    if (bonusScore < 0) {
        bonusScore = 0;
    }
    return bonusScore + Math.sqrt(food.monthSell || 0.5);
};
const currentCity = computed(() => store.state.currentCity);
const searchAddress = computed(() => store.state.searchAddress);
const goodsList = computed(() => store.state.goodsSearchList);
const searchLen = computed(() => {
    const len = (searchAddress.value.length || 3) + 5;
    return 24 - len < 4 ? 4 : 24 - len;
});
const groupItems = computed(() => {
    const group = _.groupBy(goodsList.value, (item) => {
        item.goodsCount = 0;
        item.scoreWeight = scoreSort(item);
        return item.storeName;
    });
    const list = _.keys(group).map((storeName) => {
        const curList = goodsList.value.filter(
            (item) => item.storeName == storeName
        );
        return {
            text: storeName,
            deliveryActivity: curList?.[0]?.deliveryActivity || {},
            descs: curList?.[0]?.descs || [],
            imagePath: curList?.[0]?.imagePath || '',
            priceSortWeight: curList.reduce((pre, val) => {
                return pre + scoreSort(val);
            }, 0)
        };
    });
    const sortList = _.sortBy(list, [
        function (food) {
            return food.priceSortWeight;
        }
    ]);
    return _.reverse(sortList);
});
const cartsList = computed(() => {
    return _.filter(goodsList.value, (item) => {
        return item.goodsCount > 0;
    });
});

const onClickLeft = () => {
    history.back();
};
const onClickRight = () => {
    router.push({
        name: 'List'
    });
};
</script>
