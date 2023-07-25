<template>
    <van-nav-bar
        @click-right="onClickRight"
        right-text="历史门店"
        @click-left="onClickLeft"
        title="选择门店"
        left-text="返回"
        left-arrow
    />
    <van-space direction="vertical" fill>
        <AddressSearch @handleChange="searchLocation" />
        <div class="store-list-wrapper">
            <van-list :loading="loading">
                <van-cell
                    :key="item?.text"
                    v-for="item in list"
                    @click="selectStoreId(item)"
                    is-link
                >
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                        <span class="custom-title">
                            {{ item?.text }}
                            <span>|</span>
                            <span>
                                <van-tag color="#ffe1e1" text-color="#ad0000">
                                    {{
                                        item?.piecewiseAgentFee?.description ||
                                        `配送费: ${item.floatDeliveryFee}元`
                                    }}
                                </van-tag>
                            </span>
                        </span>
                        <van-space fill>
                            <van-tag
                                type="primary"
                                v-for="(tag, index) in item.descs"
                                :key="tag?.text"
                                >{{ tag?.text }}</van-tag
                            >
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
                    <van-cell
                        center
                        @click="selectStoreId(item)"
                        is-link
                        v-for="item in historyStoreList"
                        :key="item"
                        :title="item.text"
                    >
                        <template #icon>
                            <van-icon
                                v-if="!item.collected"
                                name="star-o"
                                @click="storeMark(item, true, $event)"
                            />
                            <van-icon
                                v-if="item.collected"
                                name="star"
                                @click="storeMark(item, false, $event)"
                            />
                        </template>
                    </van-cell>
                </van-list>
            </template>
        </van-tree-select>
    </van-action-sheet>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { showToast } from 'vant';

import { Store, groupCopywriting } from '@/utils/index.js';
import { queryStoreListByAddress } from '@/api/index.js';
import AddressSearch from '@/components/AddressSearch.vue';

const store = useStore();
const loading = ref(false);
const historyShow = ref(false);
const list = ref([]);
const historyList = ref(Store('historyList') || []);
const router = useRouter();
const historyIndex = ref(0);

const searchLocation = async ({ lngInfo, kword }) => {
    loading.value = true;
    try {
        const res = await queryStoreListByAddress({
            keyword: kword,
            lat: lngInfo.lat,
            lng: lngInfo.log
        });
        loading.value = false;
        list.value = res.data.list;
    } catch (err) {
        loading.value = false;
    }
};
const historyGroupStoreList = computed(() => {
    const list = _.uniqBy(historyList.value, 'text');
    const group = groupCopywriting(list.map((item) => item.text));
    return _.keys(group).map((item) => {
        return {
            text: item,
            children: group[item].map((name) => {
                text: name;
            })
        };
    });
});
const historyStoreList = computed(() => {
    const name = historyGroupStoreList.value[historyIndex.value].text;
    return _.uniqBy(
        historyList.value.filter((item) => item.text.indexOf(name) > -1),
        'text'
    );
});
const onClickLeft = () => {
    history.back();
};
const onClickRight = () => {
    historyShow.value = true;
};
const storeMark = (item, mark, event) => {
    event.preventDefault();
    event.stopPropagation();
    showToast(mark ? '收藏成功' : '已取消收藏');
    item.collected = mark;
    Store('historyList', _.uniqBy(historyList.value, 'text'));
};
const selectStoreId = (item) => {
    historyList.value.push(item);
    store.commit('select_store_id', item);
    router.push({
        name: 'List'
    });
    Store('historyList', _.uniqBy(historyList.value, 'text'));
};
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
