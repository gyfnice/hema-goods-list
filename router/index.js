const koa_router = require('koa-router');
const router = koa_router();
const api = require('@/controller/index.js');
const { run } = require('@/api.js')

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


module.exports = router;
