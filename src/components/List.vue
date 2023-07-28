<template>
    <van-list :loading="loading">
        <van-card
            @click-thumb="selectCard(item)"
            v-for="item in list"
            :key="item"
            :num="item.realLeftNum"
            :tag="item?.couponTag?.actDesc || ''"
            :origin-price="item.originalPrice"
            :price="`${item.currentPrice}`"
            :desc="`${item.sellText}`"
            :title="item.name"
            :thumb="item?.photos?.[0]?.url || ''"
        >
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
                    <van-button
                        v-if="hasShopName && !hasCartCompare"
                        @click="goShopStore(item)"
                        size="small"
                        plain
                        type="primary"
                        >点击去门店购买</van-button
                    >
                    <van-tag v-if="hasCartCompare" plain type="primary">{{
                        item.storeName
                    }}</van-tag>
                </van-space>
            </template>
        </van-card>
    </van-list>
    <van-dialog
        v-model:show="lineShow"
        title="价格趋势"
        :close-on-click-overlay="lineLoading"
        :show-cancel-button="false"
        :show-confirm-button="!lineLoading"
    >
        <van-loading v-if="lineLoading" />
        <Line
            :list="lineData"
            :title="currentItemInfo.text"
            v-if="lineData.length > 0"
        />
    </van-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
// import { useFuse } from '@vueuse/integrations/useFuse';
import { useRouter } from 'vue-router';

import { queryGoodsPriceHistory } from '@/api/index.js';
import Line from '@/components/Line.vue';

const router = useRouter();
const props = defineProps({
    list: Array,
    loading: Boolean,
    hasShopName: Boolean,
    hasCartCompare: Boolean,
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
    lineShow.value = true;
    lineData.value = [];
    currentItemInfo.value.text = item.name;
    try {
        lineLoading.value = true;
        const res = await queryGoodsPriceHistory({
            storeId: item.storeId,
            name: item.name
        });
        lineData.value = res?.data?.list || [];
        lineLoading.value = false;
    } catch (res) {
        lineLoading.value = false;
    }
};
const selectCard = (item) => {
    store.commit('select_photo', item);
};
const goShopStore = ({ storeId, storeName }) => {
    router.push({
        name: 'List',
        query: {
            storeId,
            storeName
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
