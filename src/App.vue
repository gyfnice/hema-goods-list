<template>
    <van-dialog
        :show-confirm-button="false"
        :show="showPhoto"
        :title="currentGoodsItem.name"
        :close-on-click-overlay="true"
    >
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="item in photos" :key="item">
                <van-image fit="cover" position="center" :src="item.url" />
            </van-swipe-item>
        </van-swipe>
        <van-button @click="hidePhotoModal" type="primary" block
            >关闭</van-button
        >
    </van-dialog>
    <van-dialog
        v-if="lineShow"
        v-model:show="lineShow"
        title="趋势分析"
        :close-on-click-overlay="lineLoading"
        :show-cancel-button="false"
        :show-confirm-button="false"
    >
        <van-space align="center" fill direction="vertical">
            <van-loading v-if="lineLoading">价格趋势加载中...</van-loading>
        </van-space>
        <Line :list="lineData" :title="lineGoodsItem.name" v-if="lineShow" />
        <van-space align="center" fill direction="vertical">
            <h4>{{ lineGoodsItem.name }}</h4>
            <van-image
                width="10rem"
                height="10rem"
                fit="contain"
                :src="lineGoodsItem.url"
            />
        </van-space>
        <van-button @click="hideLineModal" type="primary" block
            >关闭</van-button
        >
    </van-dialog>
    <router-view></router-view>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import Line from '@/components/Line.vue';

export default {
    components: {
        Line
    },
    computed: {
        ...mapState([
            'currentStoreItem',
            'photos',
            'lineShow',
            'lineLoading',
            'lineData',
            'lineGoodsItem',
            'showPhoto',
            'currentGoodsItem'
        ])
    },
    methods: {
        ...mapMutations(['hidePhotoModal', 'hideLineModal'])
    }
};
</script>
<style scoped></style>
