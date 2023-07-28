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
    <router-view></router-view>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
    computed: {
        ...mapState([
            'currentStoreItem',
            'photos',
            'showPhoto',
            'currentGoodsItem'
        ])
    },
    methods: {
        ...mapMutations(['hidePhotoModal'])
    }
};
</script>
<style scoped></style>
