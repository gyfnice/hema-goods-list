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
                    <van-stepper
                        @change="stepperChange(item)"
                        :show-input="item.goodsCount > 0"
                        :show-minus="item.goodsCount > 0"
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
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
// import { useFuse } from '@vueuse/integrations/useFuse';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    list: Array,
    loading: Boolean,
    hasShopName: Boolean,
    hasCartCompare: Boolean,
    isFuzzy: String,
    isGoodsCart: Boolean
});
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
