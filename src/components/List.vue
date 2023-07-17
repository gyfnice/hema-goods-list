<template>
    <van-list
      :loading="loading"
    >
      <van-card
        @click-thumb="selectCard(item)"
        v-for="item in list" :key="item"
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
              <van-checkbox v-model="item.goodsChecked" checked-color="#ee0a24"></van-checkbox>
            </div>
            <van-stepper @change="stepperChange(item)" :show-input="item.goodsCount > 0" :show-minus="item.goodsCount > 0" :min="0" v-model="item.goodsCount" theme="round" button-size="22" disable-input />
          </van-space>
        </template>
      </van-card>
    </van-list>
</template>

<script setup>
  import { useStore } from 'vuex';
  const props = defineProps({
    list: Array,
    loading: Boolean,
    isGoodsCart: Boolean,
  });

  const store = useStore();
  const selectCard = (item) => {
    store.commit('select_photo', item);
  }
  const stepperChange = (item) => {
    if(!props.isGoodsCart) {
      item.goodsChecked = true;
    }
  }
</script>
<style scoped>
  .check-goods-wrapper {
    position: absolute;
    left: 6px;
    top: 44px;
  }
</style>