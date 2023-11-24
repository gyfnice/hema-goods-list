<template>
    <van-row>
        <van-col span="8">
            <van-cell
                center
                @click="showPicker = true"
                is-link
                :title="currentCity"
            >
                <template #icon>
                    <van-icon name="location-o" />
                </template>
            </van-cell>
        </van-col>
        <van-col span="16">
            <van-search
                :disabled="!currentCity"
                v-model="keyword"
                placeholder="小区、学校"
            />
        </van-col>
    </van-row>
    <div class="history-area-wrapper" v-if="hasHistory">
        <van-divider
            :style="{
                color: '#1989fa',
                borderColor: '#1989fa',
                margin: '0 0px',
                marginBottom: '10px'
            }"
        >
            搜索历史
        </van-divider>
        <van-space fill wrap>
            <van-tag
                @click="tagAddressClick(item)"
                plain
                size="medium"
                type="primary"
                :key="item"
                v-for="item in selectedHistoryAddress"
                >{{ item.city }}•{{ item.address }}</van-tag
            >
        </van-space>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
        />
    </van-popup>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue';

import { useStore } from 'vuex';
import { cityMapInfo } from '@/config/city.js';
const emit = defineEmits(['handleChange', 'hidePane']);
const props = defineProps({
    hasHistory: Boolean
});
const store = useStore();
const showPicker = ref(false);
const keyword = ref('');

const currentCity = computed(() => store.state.currentCity);
const searchAddress = computed(() => store.state.searchAddress);
const selectedHistoryAddress = computed(
    () => store.state.selectedHistoryAddress
);
const columns = [
    { text: '北京', value: '0' },
    { text: '天津', value: '912' },
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
    { text: '苏州', value: '14' }
];
const tagAddressClick = (item) => {
    store.commit('selectCity', item.city);
    store.commit('changeAddress', item.address);
    emit('hidePane');
};
const onConfirm = ({ selectedOptions }) => {
    showPicker.value = false;
    const cityName = selectedOptions[0].text;
    store.commit('selectCity', cityName);
};
onMounted(() => {
    keyword.value = searchAddress.value;
});
watch(
    () => keyword.value,
    _.debounce(async (value) => {
        if (!value || !value.trim()) {
            return;
        }
        const kword = value.trim();
        const info = cityMapInfo[currentCity.value];
        store.commit('changeAddress', kword);
        emit('handleChange', {
            lngInfo: info,
            kword
        });
    }, 500)
);
</script>
