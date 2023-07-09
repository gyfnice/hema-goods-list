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
    </van-form>
</template>

<script setup>
  import { ref } from 'vue'

  import { showToast } from 'vant';

  import { sendAuthCookie } from '@/api';

  const onClickLeft = () => {
    history.back();
  }
  const token = ref('');
  const loading = ref(false);
  const onSubmit = async (values) => {
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
  
</style>