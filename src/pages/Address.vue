<template>
    <van-nav-bar @click-right="onClickRight" right-text="历史门店" @click-left="onClickLeft" title="选择门店" left-text="返回" left-arrow />
    <van-space direction="vertical" fill>
      <van-row>
        <van-col span="10">
          <van-field
            v-model="fieldValue"
            is-link
            readonly
            label="城市"
            placeholder="选择城市"
            @click="showPicker = true"
          />
        </van-col>
        <van-col span="14">
          <van-search
            :disabled="!fieldValue"
            v-model="keyword"
            placeholder="小区、学校"
            @search="onSearch"
          />
        </van-col>
      </van-row>
      <div class="store-list-wrapper">
        <van-list :loading="loading">
          <van-cell :key="item?.text" v-for="item in list" @click="selectStoreId(item)" is-link>
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
              <span class="custom-title">{{ item?.text }}</span>
              <van-space fill>
                <van-tag type="primary" v-for="(tag, index) in item.descs" :key="tag?.text">{{ tag?.text }}</van-tag>
              </van-space>
            </template>
          </van-cell>
        </van-list>
      </div>
    </van-space>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <van-action-sheet v-model:show="historyShow" title="历史门店">
      <!-- <van-list>
        <van-cell center @click="selectStoreId(item)" is-link v-for="item in historyStoreList" :key="item" :title="item.text">
          <template #icon>
            <van-icon v-if="!item.collected" name="star-o" @click="storeMark(item, true, $event)" />
            <van-icon v-if="item.collected" name="star" @click="storeMark(item, false, $event)" />
          </template>
        </van-cell>
      </van-list> -->
      <van-tree-select
        v-model:main-active-index="historyIndex"
        height="90vh"
        :items="historyGroupStoreList"
      >
        <template #content>
          <van-list>
            <van-cell center @click="selectStoreId(item)" is-link v-for="item in historyStoreList" :key="item" :title="item.text">
              <template #icon>
                <van-icon v-if="!item.collected" name="star-o" @click="storeMark(item, true, $event)" />
                <van-icon v-if="item.collected" name="star" @click="storeMark(item, false, $event)" />
              </template>
            </van-cell>
          </van-list>
        </template>
      </van-tree-select>
    </van-action-sheet>

</template>
  
<script setup>
  import { ref, watch, computed } from 'vue'

  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { showToast } from 'vant';

  import { Store, groupCopywriting } from '@/utils/index.js';
  import { cityMapInfo } from '@/config/city.js';
  import { queryStoreListByAddress } from '@/api/index.js';

  const store = useStore();
  const showPicker = ref(false);
  const loading = ref(false);
  const historyShow = ref(false);
  const fieldValue = ref('北京');
  const keyword = ref('');
  const list = ref([])
  const historyList = ref(Store('historyList') || [])
  const router = useRouter();
  const historyIndex = ref(0);
  const columns = [
    { text: '北京', value: '0' },
    { text: '上海', value: '1' },
    { text: '杭州', value: '2' },
    { text: '深圳', value: '3' },
    { text: '广州', value: '4' },
    { text: '东莞', value: '24' },
    { text: '贵阳', value: '5' },
    { text: '哈尔滨', value: '6' },
    { text: '重庆', value: '7' },
    { text: '南昌', value: '8' },
    { text: '新余', value: '110' },
    { text: '丰城', value: '112' },
    { text: '大连', value: '9' },
    { text: '长沙', value: '10' },
    { text: '株洲', value: '11' },
    { text: '大理', value: '12' },
    { text: '南京', value: '13' },
    { text: '苏州', value: '14' },
  ];
  const onConfirm = ({ selectedOptions }) => {
    showPicker.value = false;
    const cityName = selectedOptions[0].text
    fieldValue.value = cityName;
  };
  watch(
      () => keyword.value,
      _.debounce(async (value) => {
          const info = cityMapInfo[fieldValue.value];
          loading.value = true;
          const res = await queryStoreListByAddress({
            keyword: value,
            lat: info.lat,
            lng: info.log
          });
          loading.value = false;
          list.value = res.data.list;
      }, 500)
  );
  const historyGroupStoreList = computed(() => {
    const list = _.uniqBy(historyList.value, 'text');
    const group = groupCopywriting(list.map(item => item.text));
    return _.keys(group).map(item => {
      return {
        text: item,
        children: group[item].map(name => {
          text:  name
        })
      }
    });
  });
  const historyStoreList = computed(() => {
    const name = historyGroupStoreList.value[historyIndex.value].text;
    return _.uniqBy(historyList.value.filter(item => item.text.indexOf(name) > -1), 'text')
  });
  const onClickLeft = () => {
    history.back();
  }
  const onClickRight = () => {
    historyShow.value = true;
  }
  const storeMark = (item, mark, event) => {
    event.preventDefault();
    event.stopPropagation();
    showToast(mark ? '收藏成功' : '已取消收藏');
    item.collected = mark;
    Store('historyList', _.uniqBy(historyList.value, 'text'))
  }
  const selectStoreId = (item) => {
    historyList.value.push(item);
    store.commit('select_store_id', item);
    router.push({
      name: 'List'
    });
    Store('historyList', _.uniqBy(historyList.value, 'text'))
  }
</script>
  
<style lang="less">
  .store-list-wrapper {
    .van-space--fill {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }
  }
</style>