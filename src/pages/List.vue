<template>
    <div class="list-wrapper">
        <van-nav-bar :title="currentStoreItem?.text">
            <template #right>
                <van-space fill>
                    <van-icon @click="shareStore" name="share-o" />
                    <van-icon @click="goQueryGoods" name="aim" />
                    <van-icon
                        v-if="collectStoreList.length > 0"
                        @click="switchStore"
                        name="exchange"
                    />
                    <van-icon @click="selectCity" name="search" size="18" />
                </van-space>
            </template>
        </van-nav-bar>
        <van-tree-select
            v-model:main-active-index="activeIndex"
            height="90vh"
            :items="items"
        >
            <template #content>
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
                    </div>
                </van-sticky>
                <List :loading="loading" :list="filterCouponList" />
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
    <van-dialog
        :show-confirm-button="false"
        :show="showPhoto"
        :title="currentGoodsItem.name"
        :close-on-click-overlay="true"
    >
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="item in photos" :key="item">
                <van-image fit="cover" position="center" :src="item.url" />
            </van-swipe-item>
        </van-swipe>
        <van-button @click="hidePhotoModal" type="primary" block
            >关闭</van-button
        >
    </van-dialog>
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
let storeMap = {};
export default {
    created() {
        this.$store.dispatch('fetchQueryParams', this.$route.query);
    },
    data() {
        return {
            hotTags: ['奶', '酒', '猪', '鱼', '虾', '蛋', '鸡', '乳'],
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
        ...mapState([
            'currentStoreItem',
            'photos',
            'showPhoto',
            'currentGoodsItem'
        ]),
        ...mapGetters(['currentStoreId']),
        collectStoreList() {
            const list = this.collectList
                .filter((item) => item.collected)
                .map((item) => {
                    item.name = item.text;
                    return item;
                });
            return _.uniqBy(list, 'name');
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
            console.log('fList :>> ', fList);
            return fList;
        }
    },
    components: {
        List
    },
    async mounted() {
        this.collectList = Store('historyList') || [];
        // this.onLoad();
        this.fetchList();
    },
    methods: {
        ...mapMutations(['hidePhotoModal', 'select_store_id']),
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
                const res = await getGoodsListByServer({
                    storeId
                });
                this.loading = false;
                if (res.data.state === 401) {
                    showToast(res?.data?.message);
                    return;
                }
                storeMap[storeId] = _.uniqBy(
                    res.data.list.map((item) => {
                        item.goodsCount = 0;
                        return item;
                    }),
                    'name'
                );
            }
            this.list = storeMap[storeId];
        }
    }
};
</script>
<style>
body #app .list-wrapper .van-popup {
    bottom: 50px;
}
</style>
<style scoped>
.list-wrapper .van-list {
    padding-bottom: 20px;
}
.list-wrapper .van-submit-bar {
    z-index: 3000;
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
