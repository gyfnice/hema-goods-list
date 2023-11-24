<template>
    <van-nav-bar
        @click-right="onClickRight"
        :right-text="historyList.length > 0 ? '历史门店' : ''"
        @click-left="onClickLeft"
        title="选择门店"
        left-text="返回"
        left-arrow
    />
    <van-space direction="vertical" fill>
        <AddressSearch @handleChange="searchLocation" />
        <van-space fill style="justify-content: end; margin-right: 12px">
            <van-switch size="14px" v-model="isFilterFee" />
            <span style="font-size: 12px; color: rgb(102, 102, 102)"
                >忽略高配送费</span
            >
        </van-space>
        <div class="store-list-wrapper">
            <van-list :loading="loading">
                <van-cell
                    :key="item?.text"
                    v-for="item in addressList"
                    @click="selectStoreId(item)"
                    is-link
                >
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                        <StoreNameBar :item="item || {}" />
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
import { ref, computed, onMounted } from 'vue';

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { showToast } from 'vant';

import { Store, groupCopywriting } from '@/utils/index.js';
import { queryStoreListByAddress } from '@/api/index.js';
import AddressSearch from '@/components/AddressSearch.vue';
import StoreNameBar from '@/components/UI/StoreNameBar.vue';

const MAX_DELIVERY_FEE = 4;

const store = useStore();
const loading = ref(false);
const historyShow = ref(false);
const isFilterFee = ref(false);
const list = ref([]);
const historyList = ref(Store('historyList') || []);
const router = useRouter();
const historyIndex = ref(0);

onMounted(() => {
    historyList.value = Store('historyList') || [];
});
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
const addressList = computed(() => {
    if (!isFilterFee.value) return list.value;
    return list.value.filter((item) => {
        const deliveryPrice =
            item?.deliveryActivity?.deliveryMsg?.match(/配送¥(\d+)/)?.[1] || 0;
        if (Number(deliveryPrice) > MAX_DELIVERY_FEE) {
            return false;
        }
        return true;
    });
});
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
    if (
        !_.find(historyList.value, (o) => {
            return o.storeId == item.storeId;
        })
    ) {
        historyList.value.push(item);
        Store('historyList', _.uniqBy(historyList.value, 'text'));
    }
    store.commit('select_store_id', item);
    router.push({
        name: 'List',
        query: {
            isShop: 1
        }
    });
};
</script>

<style>
.store-list-wrapper {
    padding-bottom: 60px;
}
.store-list-wrapper .van-space--fill {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
}
</style>
