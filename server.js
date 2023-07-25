const path = require('path');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');
const router = require('./router'); // 服务端路由，为开发接口准备
const { setCookie } = require('./auth.js');
const { getCookie } = require('@/connection/index.js');
// Expected here; serve static files from public dir
const staticDirPath = path.join(__dirname, 'dist');

// Init Koa.js server
const server = new Koa();

const runServer = () => {
    // handle fallback for HTML5 history API
    server.use(historyApiFallback());
    // Mount the middleware
    server.use(serve(staticDirPath));
    server.use(
        cors({
            origin: '*'
        })
    );
    // Run Koa.js server
    server.use(async (ctx, next) => {
        const currentCookie = await getCookie();
        setCookie(currentCookie);
        console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
        await next();
    });
    server.use(router.routes());
    // log request URL:
    const PORT = 80;
    server.listen(PORT, () =>
        console.log(`Server Listening on PORT ${PORT} 🚀 ..`)
    );
};

module.exports = {
    runServer
};
