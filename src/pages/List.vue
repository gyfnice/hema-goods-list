<template>
  <div>
    <van-nav-bar :title="currentStoreItem?.text">
      <template #right>
        <van-space fill>
          <van-icon v-if="collectStoreList.length > 0" @click="switchStore" name="exchange" />
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
        <van-space fill>
          <van-tag @click="tagClick(item)" round type="primary" :key="item" v-for="item in hotTags">{{ item }}</van-tag>
        </van-space>
        <van-search v-model="foodsKeyword" placeholder="请输入搜索关键词" />
        <List :loading="loading" :list="filterCouponList" />
      </template>
    </van-tree-select>
    <van-submit-bar :price="totalPrice" button-text="查看购物车" @submit="onSubmit">
      <van-button @click="reset" color="linear-gradient(to right, #ff6034, #ee0a24)">
        清空
      </van-button>
    </van-submit-bar>
  </div>
  <van-dialog :show-confirm-button="false" :show="showPhoto" :title="currentGoodsItem.name" :close-on-click-overlay="true">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in photos" :key="item">
        <van-image
          fit="cover"
          position="center"
          :src="item.url"
        />
      </van-swipe-item>
    </van-swipe>
    <van-button @click="hidePhotoModal" type="primary" block>关闭</van-button>
  </van-dialog>
  <van-action-sheet v-model:show="show" title="购物车">
    <List :loading="loading" :list="goodsList" />
  </van-action-sheet>
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

import { getGoodsListByServer } from '@/api'
import { Store, groupCopywriting } from '@/utils/index.js';
import List from '@/components/List.vue';
let storeMap = {};
export default {
  data() {
    return {
      hotTags: ['牛奶', '酒', '肉', '鱼', '虾', '粉', '蛋', '鸡'],
      list: [],
      collectList: Store('historyList') || [],
      foodsKeyword: '',
      activeIndex: 0,
      show: false,
      switchVisible: false,
      loading: false,
      finished: true,
    };
  },
  computed: {
    ...mapState(['currentStoreItem', 'photos', 'showPhoto', 'currentGoodsItem']),
    ...mapGetters(['currentStoreId']),
    collectStoreList() {
      const list = this.collectList.filter(item => item.collected).map(item => {
        item.name = item.text;
        return item
      });
      return _.uniqBy(list, 'name')
    },
    totalPrice() {
      return _.reduce(this.list, (pre, item) => {
        return pre + item.goodsCount * Number(item.currentPrice)
      }, 0) * 100;
    },
    // 叠加优惠分类
    items() {
      const group = _.groupBy(this.list, (item) => {
        return item?.couponTag?.actDesc || '无叠加优惠'
      });
      const list = _.keys(group).map(couponKey => {
        return {
          text: couponKey,
          badge: group[couponKey].length
        }
      });
      return [{text: '所有特价'}].concat(list);
    },
    goodsList() {
      return _.filter(this.list, (item => {
        return item.goodsCount > 0;
      }))
    },
    filterCouponList() {
      return _.filter(this.list, (item => {
        const curTab = this.items[this.activeIndex].text
        if(curTab === '所有特价' && !this.foodsKeyword) {
          return true;
        }
        if(curTab === '所有特价' && this.foodsKeyword) {
          return item.name.indexOf(this.foodsKeyword) > -1;
        }
        return (item?.couponTag?.actDesc || '无叠加优惠') === curTab
      }))
    }
  },
  components: {
    List,
  },
  async mounted() {
    this.collectList = Store('historyList') || [];
    // this.onLoad();
    this.fetchList();
  },
  methods: {
    ...mapMutations(['hidePhotoModal', 'select_store_id']),
    onSelect(item) {
      this.select_store_id(item);
      this.fetchList();
    },
    tagClick(tag) {
      this.foodsKeyword = tag;
    },
    selectCity() {
      this.$router.push({
        name: 'address'
      })
    },
    reset() {
      this.list = this.list.map(item => {
        item.goodsCount = 0;
        return item;
      })
    },
    onSubmit() {
      this.show = true;
    },
    switchStore() {
      this.switchVisible = true;
    },
    async fetchList() {
      this.list = [];
      const storeId = this.currentStoreId
      if(!storeMap[storeId]) {
        this.loading = true;
        const res = await getGoodsListByServer({
          storeId
        });
        this.loading = false;
        if(res.data.state === 401) {
          showToast(res?.data?.message);
          return;
        }
        storeMap[storeId] = _.uniqBy(res.data.list.map(item => {
          item.goodsCount = 0;
          return item;
        }), 'name');
      }
      this.list = storeMap[storeId];
    }
  },
};
</script>
<style scoped>
  .my-swipe {
    margin-top: 10px;
  }
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
  }
</style>