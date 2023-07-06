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
          <van-stepper :show-input="item.goodsCount > 0" :show-minus="item.goodsCount > 0" :min="0" v-model="item.goodsCount" theme="round" button-size="22" disable-input />
        </template>
      </van-card>
    </van-list>
</template>

<script setup>
  import { useStore } from 'vuex';
  defineProps({
    list: Array,
    loading: Boolean,
  });

  const store = useStore();
  const selectCard = (item) => {
    console.log('item :>> ', item);
    store.commit('select_photo', item);
  }
</script>
<style>
</style>