const path = require("path");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");
const Koa = require("koa");
const cors = require("@koa/cors");
const serve = require("koa-static");
const router = require("./router"); // 服务端路由，为开发接口准备
// Expected here; serve static files from public dir
const staticDirPath = path.join(__dirname, "dist");

// Init Koa.js server
const server = new Koa();

const runServer = () => {
  // handle fallback for HTML5 history API
  server.use(router.routes());
  server.use(historyApiFallback());
  // Mount the middleware
  server.use(serve(staticDirPath));

  server.use(
    cors({
      origin: "*"
    })
  );
  // Run Koa.js server

  // log request URL:
  server.use(async (ctx, next) => {
    console.log(
      `Process ${ctx.request.method} ${ctx.request.url}...`
    );
    await next();
  });
  const PORT = 8081;
  server.listen(PORT, () =>
    console.log(
      `Server Listening on PORT ${PORT} 🚀 ..`
    )
  );
}

module.exports = {
  runServer
};
