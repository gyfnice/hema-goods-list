const koa_router = require('koa-router');
const router = koa_router();
const api = require('@/controller/index.js');
const { run, queryAddress } = require("@/api.js");
const { setCookie } = require("@/auth.js");

// 获取商品列表接口
router.get("/api/hema/goodsList", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  const storeId = queryParams.storeId;
  const list = await run(storeId);
  context.response.body = {
    state: 1,
    list
  };
});
// 获取地址列表
router.get("/api/hema/queryAddress", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  const list = await queryAddress(queryParams);
  context.response.body = {
    state: 1,
    list
  };
});
// 设置cookie
router.get("/api/hema/setAuth", async (context) => {
  // context 上下文
  const queryParams = context.request.query;
  setCookie(queryParams.authToken);
  context.response.body = {
    state: 'success',
  };
});


module.exports = router;
