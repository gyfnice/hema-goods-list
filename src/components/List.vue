<template>
    <van-list :loading="loading">
        <van-card
            @click-thumb="selectCard(item)"
            v-for="(item, index) in list"
            :key="item"
            :num="item.realLeftNum"
            :tag="item?.couponTag?.actDesc || ''"
            :origin-price="item.originalPrice"
            :price="`${item.currentPrice}`"
            :title="item.name"
            :thumb="item?.photos?.[0]?.url || ''"
        >
            <template #desc>
                <van-space>
                    <span>{{ item.sellText }}</span>
                    <van-tag>排名:{{ index + 1 }}</van-tag>
                    <van-tag v-if="isCollectMode" plain
                        >分数:{{
                            Number(item.priceSortWeight).toFixed(2) || 0
                        }}</van-tag
                    >
                </van-space>
            </template>
            <template #footer>
                <van-space>
                    <div class="check-goods-wrapper" v-if="isGoodsCart">
                        <van-checkbox
                            v-model="item.goodsChecked"
                            checked-color="#ee0a24"
                        ></van-checkbox>
                    </div>
                    <van-icon
                        @click="displayLineChart(item)"
                        name="chart-trending-o"
                        size="20"
                        color="#1989fa"
                    />
                    <van-tag
                        v-if="item?.dishActivity?.[0]?.detailText === '限1份'"
                        plain
                        type="primary"
                        >{{ item?.dishActivity?.[0]?.detailText }}</van-tag
                    >
                    <van-tag v-if="item.startWith > 1" plain type="primary"
                        >{{ item.startWith }}份起购</van-tag
                    >

                    <van-stepper
                        @change="stepperChange(item)"
                        :show-input="item.goodsCount > 0"
                        :show-minus="item.goodsCount > 0"
                        :step="item.startWith || 1"
                        :min="0"
                        v-model="item.goodsCount"
                        theme="round"
                        button-size="22"
                        disable-input
                    />
                    <van-space direction="vertical">
                        <van-tag
                            :text-color="stringToColor(item.storeName)"
                            :color="stringToColor(item.storeName)"
                            v-if="hasCartCompare"
                            plain
                            type="primary"
                            >{{ item.storeName }}</van-tag
                        >
                        <van-tag
                            v-if="
                                (hasShopName && !hasCartCompare) ||
                                isCollectMode
                            "
                            @click="goShopStore(item)"
                            size="small"
                            plain
                            type="primary"
                            >去门店购买</van-tag
                        >
                    </van-space>
                </van-space>
            </template>
        </van-card>
    </van-list>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
// import { useFuse } from '@vueuse/integrations/useFuse';
import { useRouter } from 'vue-router';

import { stringToColor } from '@/utils/index.js';

const router = useRouter();
const props = defineProps({
    list: Array,
    loading: Boolean,
    hasShopName: Boolean,
    hasCartCompare: Boolean,
    isCollectMode: Boolean,
    isFuzzy: String,
    isGoodsCart: Boolean
});
const currentItemInfo = ref({
    text: ''
});
const lineShow = ref(false);
const lineLoading = ref(false);
const lineData = ref([]);
/* const input = ref(props.isFuzzy);

const { results } = useFuse(input, props.list, {
    fuseOptions: {
        keys: ['name']
    }
});
watch(
    () => props.isFuzzy,
    (value) => {
        input.value = value;
    }
);
const goodsList = computed(() => {
    return results.value
        .filter((item) => {
            return item.refIndex <= 4;
        })
        .map((item) => item.item);
}); */
const store = useStore();
const displayLineChart = async (item) => {
    store.dispatch('fetchGoodsLineChart', item);
};
const selectCard = (item) => {
    store.commit('select_photo', item);
};
const goShopStore = (item) => {
    item.text = item.storeName;
    store.commit('select_store_id', item);
    router.push({
        name: 'List',
        query: {
            isShop: 1
        }
    });
};
const stepperChange = (item) => {
    if (!props.isGoodsCart) {
        item.goodsChecked = true;
    }
};
</script>
<style scoped>
.check-goods-wrapper {
    position: absolute;
    left: 6px;
    top: 44px;
}
</style>
