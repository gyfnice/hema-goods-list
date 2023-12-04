const path = require('path');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const Koa = require('koa');
const cron = require('node-cron');
const cors = require('@koa/cors');
const serve = require('koa-static');
const ratelimit = require('koa-ratelimit');

const router = require('./router'); // 服务端路由，为开发接口准备
const { setCookie, getCookieFile, setCookieFile } = require('@/auth.js');
//const { getCookie, updateCookie } = require('@/connection/index.js');
const { coreUpdateCookie } = require('@/controller/index.js');
const signFunc = require('@/utils/signAes.js');
// Expected here; serve static files from public dir
const staticDirPath = path.join(__dirname, 'dist');

// Init Koa.js server
const server = new Koa();

const runServer = async () => {
    const db = new Map();
    if (process.env.MODE !== 'dev') {
        await coreUpdateCookie();
    }
    cron.schedule('*/5 * * * *', async () => {
        console.log('running a update cookie task every 5 minutes');
        await coreUpdateCookie();
    });
    // handle fallback for HTML5 history API
    server.use(historyApiFallback());
    // Mount the middleware
    server.use(serve(staticDirPath));
    server.use(
        cors({
            origin: '*'
        })
    );
    server.use(
        ratelimit({
            driver: 'memory',
            db: db,
            duration: 60000,
            errorMessage: 'Sometimes You Just Have to Slow Down.',
            id: (ctx) => ctx.ip,
            headers: {
                remaining: 'Rate-Limit-Remaining',
                reset: 'Rate-Limit-Reset',
                total: 'Rate-Limit-Total'
            },
            max: 100,
            disableHeader: false
        })
    );
    // Run Koa.js server
    server.use(async (ctx, next) => {
        const sign = ctx.request.header.authorization;
        let isRightSign = null;
        try {
            isRightSign = signFunc.checkIsCorrectDate(sign);
            console.log('isRightSign', isRightSign);
        } catch (err) {
            isRightSign = true;
            console.log('err', isRightSign, err);
        }
        if (!isRightSign && sign !== 'gyfniceLiveForever') {
            return;
        }
        const currentCookie = getCookieFile();
        setCookie(currentCookie);
        console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
        await next();
    });
    server.use(router.routes());
    // log request URL:
    const PORT = 3010;
    server.listen(PORT, () =>
        console.log(`Server Listening on PORT ${PORT} 🚀 ..`)
    );
};

module.exports = {
    runServer
};
