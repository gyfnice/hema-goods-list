const koa_router = require('koa-router');
const router = koa_router();
const {
  queryChannelStore,
  queryAllTaskStore
} = require("@/controller/index.js");
const { run, queryAddress, requestByLngLat } = require("@/api.js");
const { updateCookie, getCookie } = require("@/connection/index.js");

// 获取商品列表接口
router.get("/api/hema/goodsList", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  const storeId = queryParams.storeId;
  const list = await run(storeId);
  if(list?.code === 401) {
    context.response.body = {
      state: 401,
      message: list?.message
    };
    return;
  }
  context.response.body = {
    state: 1,
    list
  };
});
// 获取地址列表
router.get("/api/hema/queryAddress", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  //const list = await queryAddress(queryParams);
  const list = await queryAllTaskStore(queryParams);
  context.response.body = {
    state: 1,
    list
  };
});
// 测试搜索地址
router.get("/api/hema/queryStoreText", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  const res = await queryChannelStore();
  context.response.body = {
    state: 1,
    list: res
  };
});
// 设置cookie
router.get("/api/hema/setAuth", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  await updateCookie(queryParams.authToken);
  context.response.body = {
    state: 'success',
  };
});
// 查看cookie
router.get("/api/hema/queryToken", async (context) => {
  // context 上下文
  const content = await getCookie();
  context.response.body = {
    state: "success",
    content
  };
});


module.exports = router;
