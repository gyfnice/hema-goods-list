<template>
  <div>
    <van-nav-bar title="盒马一峰每日商品特价列表" />
    <van-list
      :loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-card
        v-for="item in list" :key="item"
        :num="item.monthSell"
        :price="`${item.currentPrice}-${item.originalPrice}`"
        :desc="item.sellText"
        :title="item.name"
        :thumb="item?.photos?.[0]?.url || ''"
      />
    </van-list>
  </div>
</template>

<script>

import { getGoodsListByServer } from '@/api'
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: true,
    };
  },
  async mounted() {
    // this.onLoad();
    const storeId = this.$route.query.storeId
    const res = await getGoodsListByServer({
      storeId
    });
    this.list = res.data.list;
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
  },
};
</script>