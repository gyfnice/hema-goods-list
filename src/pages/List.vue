<template>
    <div class="list-wrapper">
        <van-nav-bar :title="currentStoreItem?.text || currentStoreItem?.name">
            <template #left>
                <van-space>
                    <van-icon
                        @click="toggleCollect"
                        :name="isCollectStore ? 'like' : 'like-o'"
                        size="18"
                    />
                    <!-- <van-icon name="bar-chart-o" /> -->
                </van-space>
            </template>
            <template #right>
                <van-space fill>
                    <van-icon @click="shareStore" name="share-o" />
                    <van-icon
                        v-if="collectStoreList.length > 0"
                        @click="switchStore"
                        name="exchange"
                    />
                </van-space>
            </template>
        </van-nav-bar>
        <van-tree-select
            v-model:main-active-index="activeIndex"
            height="90vh"
            :items="items"
        >
            <template #content>
                <div class="nav-search-wrapper">
                    <StoreNameBar
                        v-if="currentStoreItem?.deliveryActivity"
                        sourceFrom="home"
                        :item="currentStoreItem || {}"
                    />
                </div>
                <van-sticky :offset-top="40">
                    <div class="nav-search-wrapper">
                        <van-space fill>
                            <van-tag
                                @click="tagClick(item)"
                                plain
                                type="primary"
                                :key="item"
                                v-for="item in hotTags"
                                >{{ item }}</van-tag
                            >
                        </van-space>
                        <van-search
                            v-model="foodsKeyword"
                            placeholder="请输入搜索关键词"
                        />
                        <van-slider
                            v-if="currentSort === 'currentPrice'"
                            class="slider-price-wrapper"
                            v-model="rangePrice"
                            :max="maxPrice"
                            range
                        >
                            <template #left-button>
                                <div class="custom-button">
                                    {{ rangePrice[0] }}
                                </div>
                            </template>
                            <template #right-button>
                                <div class="custom-button">
                                    {{ rangePrice[1] }}
                                </div>
                            </template>
                        </van-slider>
                        <van-space
                            fill
                            style="
                                justify-content: flex-end;
                                padding: 10px;
                                padding-top: 0;
                            "
                        >
                            <van-tag
                                color="#fff"
                                :text-color="
                                    item.active ? '#1989fa' : '#969799'
                                "
                                @click="tagSortClick(item)"
                                :key="item"
                                v-for="item in sortTags"
                                >{{ item.name }}</van-tag
                            >
                        </van-space>
                    </div>
                </van-sticky>
                <List
                    :loading="loading"
                    v-if="currentSort !== 'currentPrice'"
                    :list="filterCouponList"
                />
                <List :loading="loading" v-else :list="rangePriceList" />
            </template>
        </van-tree-select>
        <van-submit-bar
            :price="totalPrice"
            button-text="查看购物车"
            @submit="onSubmit"
        >
            <van-button
                @click="reset"
                color="linear-gradient(to right, #ff6034, #ee0a24)"
            >
                清空
            </van-button>
        </van-submit-bar>
        <van-action-sheet v-model:show="show" title="购物车">
            <List :isGoodsCart="true" :loading="loading" :list="goodsList" />
        </van-action-sheet>
    </div>
    <van-action-sheet
        v-model:show="switchVisible"
        :actions="collectStoreList"
        @select="onSelect"
        cancel-text="取消"
        description="选择收藏的门店"
        close-on-click-action
    />
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { showToast } from 'vant';

import { getGoodsListByServer } from '@/api';
import { Store, groupCopywriting } from '@/utils/index.js';
import List from '@/components/List.vue';
import StoreNameBar from '@/components/UI/StoreNameBar.vue';

let storeMap = {};
export default {
    created() {
        this.$store.dispatch('fetchQueryParams', this.$route.query);
    },
    data() {
        return {
            hotTags: ['奶', '酒', '猪', '鱼', '虾', '蛋', '鸡', '乳'],
            sortTags: [
                {
                    name: '价格',
                    sortKey: 'currentPrice',
                    active: false
                },
                {
                    name: '销量',
                    sortKey: 'monthSell',
                    active: false
                },
                {
                    name: '库存',
                    sortKey: 'realLeftNum',
                    active: false
                }
            ],
            rangePrice: [0, 0],
            list: [],
            collectList: Store('historyList') || [],
            foodsKeyword: '',
            activeIndex: 0,
            show: false,
            switchVisible: false,
            loading: false,
            finished: true
        };
    },
    computed: {
        ...mapState(['currentStoreItem']),
        ...mapGetters(['currentStoreId']),
        isCollectStore() {
            return _.find(this.collectStoreList, (item) => {
                return item.storeId == Number(this.currentStoreId);
            });
        },
        currentSort() {
            let sort = '';
            this.sortTags.forEach((item) => {
                if (item.active) {
                    sort = item.sortKey;
                }
            });
            return sort;
        },
        collectStoreList() {
            const list = this.collectList
                .filter((item) => item.collected)
                .map((item) => {
                    item.name = item.text;
                    return item;
                });
            return _.uniqBy(list, 'storeId');
        },
        totalPrice() {
            return (
                _.reduce(
                    this.list,
                    (pre, item) => {
                        return (
                            pre +
                            item.goodsCount *
                                Number(item.currentPrice) *
                                (item.goodsChecked ? 1 : 0)
                        );
                    },
                    0
                ) * 100
            );
        },
        // 叠加优惠分类
        items() {
            const group = _.groupBy(
                this.list.map((item) => {
                    const specCouponItem = item?.dishActivity?.[0];
                    const specCouponText = `${specCouponItem?.detailTagText}|${
                        specCouponItem?.detailText
                    }|${
                        specCouponItem?.userOrderItemLimit === 0
                            ? '不互斥'
                            : '互斥'
                    }`;
                    const isSpecCoupon =
                        specCouponText &&
                        (specCouponItem?.detailText?.indexOf('限1份') > -1 ||
                            specCouponItem?.detailText?.indexOf('N选1') > -1);
                    if (isSpecCoupon) {
                        item.specCouponText = specCouponText;
                    }
                    return item;
                }),
                (item) => {
                    if (item?.couponTag?.actDesc && !item.specCouponText) {
                        return `${item?.couponTag?.actDesc}【${item?.couponTag?.categoryName}】`;
                    }
                    if (item?.specCouponText) {
                        return `优惠${item.specCouponText}`;
                    }
                    return '无优惠';
                }
            );
            const list = _.keys(group).map((couponKey) => {
                return {
                    text: couponKey,
                    badge: group[couponKey].length
                };
            });
            return [{ text: 'all' }].concat(list);
        },
        goodsList() {
            return _.filter(this.list, (item) => {
                return item.goodsCount > 0;
            });
        },
        maxPrice() {
            console.log(
                'max-this.filterCouponList :>> ',
                this.filterCouponList
            );
            const max = Number(
                _.maxBy(this.filterCouponList, function (o) {
                    return Number(o.currentPrice || 0);
                })?.currentPrice || 0
            );
            console.log('max :>> ', max);
            return Math.ceil(max);
        },
        rangePriceList() {
            function filterItemsByPriceRange(items, priceRange) {
                // Ensure priceRange is a valid array with two elements
                if (!Array.isArray(priceRange) || priceRange.length !== 2) {
                    throw new Error(
                        'Price range must be an array with two elements: [minPrice, maxPrice]'
                    );
                }

                const [minPrice, maxPrice] = priceRange;

                // Use Array.filter to filter items within the specified price range
                const filteredItems = items.filter((item) => {
                    const itemPrice = parseFloat(item.currentPrice);

                    // Check if the item's price is within the specified range
                    return itemPrice >= minPrice && itemPrice <= maxPrice;
                });

                return filteredItems;
            }
            return filterItemsByPriceRange(
                this.filterCouponList,
                this.rangePrice
            );
        },
        filterCouponList() {
            const fList = _.filter(this.list, (item) => {
                const curTab = this.items[this.activeIndex].text;
                const specCouponItem = item?.dishActivity?.[0];
                const specCouponText = `${specCouponItem?.detailTagText}|${
                    specCouponItem?.detailText
                }|${
                    specCouponItem?.userOrderItemLimit === 0 ? '不互斥' : '互斥'
                }`;
                const isSpecCoupon =
                    specCouponText &&
                    (specCouponItem?.detailText?.indexOf('限1份') > -1 ||
                        specCouponItem?.detailText?.indexOf('N选1') > -1);
                if (curTab === 'all' && !this.foodsKeyword && !isSpecCoupon) {
                    return true;
                }
                if (curTab === 'all' && this.foodsKeyword && !isSpecCoupon) {
                    return item.name.indexOf(this.foodsKeyword) > -1;
                }
                if (item?.couponTag?.actDesc && !isSpecCoupon) {
                    return (
                        `${item?.couponTag?.actDesc}【${item?.couponTag?.categoryName}】` ===
                        curTab
                    );
                }
                if (isSpecCoupon) {
                    return `优惠${specCouponText}` === curTab;
                }
                return '无优惠' === curTab;
            });
            if (this.currentSort) {
                const resList = _.sortBy(fList, [
                    (food) => {
                        return (
                            Number(
                                String(food[this.currentSort]).match(
                                    /\d+/
                                )?.[0] || 0
                            ) * (this.currentSort === 'monthSell' ? -1 : 1)
                        );
                    }
                ]);
                return resList;
            }
            return fList;
        }
    },
    components: {
        List,
        StoreNameBar
    },
    async mounted() {
        this.collectList = Store('historyList') || [];
        // this.onLoad();
        this.fetchList();
    },
    methods: {
        ...mapMutations(['select_store_id']),
        toggleCollect() {
            let list = _.uniqBy([...this.collectList], 'text');
            if (this.isCollectStore) {
                _.remove(list, (n) => {
                    return n.storeId == this.currentStoreId;
                });
            } else {
                _.remove(list, (n) => {
                    return n.storeId == this.currentStoreId;
                });
                list.push({
                    collected: true,
                    storeId: this.currentStoreId,
                    text: this.currentStoreItem?.text,
                    name: this.currentStoreItem?.text
                });
            }
            this.collectList = [...list];
            Store('historyList', list);
        },
        shareStore() {
            var oInput = document.createElement('input');
            oInput.value = `https://${window.location.hostname}?storeId=${this.currentStoreId}&storeName=${this.currentStoreItem?.text}`;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand('Copy'); // 执行浏览器复制命令
            document.body.removeChild(oInput);
            showToast('分享链接已复制到剪贴板');
        },
        goQueryGoods() {
            this.$router.push({
                name: 'goodsCompare',
                query: {}
            });
        },
        onSelect(item) {
            this.select_store_id(item);
            this.$router.replace({
                name: 'List',
                query: {}
            });
            this.fetchList();
        },
        tagClick(tag) {
            this.foodsKeyword = tag;
        },
        tagSortClick(targetItem) {
            this.sortTags.forEach((item) => {
                if (item.name != targetItem.name) {
                    item.active = false;
                }
            });
            this.rangePrice = [0, 99999999];
            targetItem.active = !targetItem.active;
            this.rangePrice[1] = this.maxPrice;
        },
        selectCity() {
            this.$router.push({
                name: 'address'
            });
        },
        reset() {
            this.list = this.list.map((item) => {
                item.goodsCount = 0;
                item.goodsChecked = false;
                return item;
            });
        },
        onSubmit() {
            this.show = true;
        },
        switchStore() {
            this.switchVisible = true;
        },
        async fetchList() {
            this.list = [];
            const storeId = this.currentStoreId;
            if (!storeMap[storeId]) {
                this.loading = true;
                try {
                    const res = await getGoodsListByServer({
                        storeId
                    });
                    this.loading = false;
                    if (res.data.state === 401) {
                        showToast(res?.data?.message);
                        return;
                    }
                    storeMap[storeId] = _.uniqBy(
                        (res?.data?.list || []).map((item) => {
                            item.goodsCount = 0;
                            return item;
                        }),
                        'name'
                    );
                } catch (err) {
                    this.loading = false;
                    this.list = [];
                }
            }
            this.list = storeMap[storeId] || [];
        }
    }
};
</script>
<style>
body #app .list-wrapper .van-popup {
    bottom: 100px;
}
body #app .list-wrapper .van-overlay {
    height: 90vh;
}
body #app .van-action-sheet {
    z-index: 12002 !important;
}
.slider-price-wrapper {
    margin-bottom: 12px;
    margin-top: 6px;
    box-sizing: border-box;
    width: 85%;
    margin-left: 12px;
}
.custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: var(--van-primary-color);
    border-radius: 100px;
}
</style>
<style scoped>
.list-wrapper .van-list {
    padding-bottom: 80px;
}
.list-wrapper .van-submit-bar {
    z-index: 1000;
    bottom: 50px;
}
.my-swipe {
    margin-top: 10px;
}
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
}
.nav-search-wrapper {
    padding-top: 10px;
    padding-left: 10px;
    background: #fff;
}
</style>
