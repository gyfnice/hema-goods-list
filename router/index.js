const koa_router = require('koa-router');
const router = koa_router();
const {
  queryChannelStore,
  queryAllTaskStore
} = require("@/controller/index.js");
const { run, queryAddress, requestByLngLat } = require("@/api.js");
const { setCookieFile, getCookie } = require("@/auth.js");

// 获取商品列表接口
router.get("/api/hema/goodsList", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  const storeId = queryParams.storeId;
  const list = await run(storeId);
  if(list === 401) {
    context.response.body = {
      state: 401,
      message: 'cookie过期，请稍后重试或联系管理员'
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
  setCookieFile(queryParams.authToken);
  context.response.body = {
    state: 'success',
  };
});
// 查看cookie
router.get("/api/hema/queryToken", async (context) => {
  // context 上下文
  context.response.body = {
    state: "success",
    content: getCookie()
  };
});


module.exports = router;
