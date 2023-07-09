<template>
    <van-nav-bar @click-left="onClickLeft" title="输入验证token" left-text="返回" left-arrow />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          :label-width="60"
          v-model="token"
          name="token"
          label="cookie"
          placeholder="请输入ele网站cookie"
          :rules="[{ required: true, message: '请填写cookie信息' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button :loading="loading" round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
      <div style="margin: 16px;">
        <van-button :loading="cookieLoading" round block @click="showCookie" >
          查看当前cookie
        </van-button>
      </div>
      <van-popup
        closeable
        v-model:show="showRight"
        position="right"
        :style="{ width: '95%', height: '100%', padding: '20px' }"
      >
        <div class="look-wrapper-content">
          <h2>cookie</h2>
          {{ lookToken }}
        </div>
      </van-popup>
    </van-form>
</template>

<script setup>
  import { ref } from 'vue'

  import { showToast } from 'vant';

  import { sendAuthCookie, queryAuthCookie } from '@/api';
  import { validateCookieString } from '@/utils';

  const onClickLeft = () => {
    history.back();
  }
  const token = ref('');
  const lookToken = ref('hello world');
  const loading = ref(false);
  const cookieLoading = ref(false);
  const showRight = ref(false);
  const showCookie = async () => {
    showRight.value = true;
    cookieLoading.value = true;
    const res = await queryAuthCookie()
    lookToken.value = res?.data?.content || '未获取'
    cookieLoading.value = false;
  }
  const onSubmit = async (values) => {
    if(!validateCookieString(values.token)) {
      showToast('cookie格式不正确，请重新输入');
      return;
    }
    loading.value = true;
    await sendAuthCookie({
      authToken: values.token
    });
    loading.value = false;
    showToast('token设置成功');
    token.value = '';
  };
</script>
  
<style>
  .look-wrapper-content {
    word-break: break-all;
  }
</style>