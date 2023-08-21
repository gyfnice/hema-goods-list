<template>
    <span class="custom-title">
        <van-space>
            {{ item?.text }}
            <slot></slot>
            <span>|</span>
        </van-space>
        <van-space v-if="item.deliveryActivity">
            <!-- <van-tag color="#ffe1e1" text-color="#ad0000">
                                    {{
                                        item?.piecewiseAgentFee?.description ||
                                        `配送费: ${item.floatDeliveryFee}元`
                                    }}
                                </van-tag> -->
            <van-tag color="#fff" text-color="#666666">
                {{ item.deliveryActivity.deliveryMsg }}
            </van-tag>
            <van-tag color="#fff" text-color="#666666">
                起送¥{{ item.deliveryActivity.startPrice }}
            </van-tag>
        </van-space>
    </span>
    <van-space fill wrap>
        <van-tag
            type="primary"
            v-for="(tag, index) in item.descs"
            :color="tag.color.frameColor"
            plain
            :text-color="tag.color.frontColor"
            :key="tag?.text || tag?.msg"
            >{{ tag?.text || tag?.msg }}</van-tag
        >
    </van-space>
</template>
<script setup>
const props = defineProps({
    item: Object
});
</script>
