const redis = require('redis');

const isProd = process?.env?.DEV_MODE_SERVER !== 'development';

// initialize using default config
// const RedisClient = redis.createClient()

let clientInstance = null;
const connectRedis = async () => {
    if (clientInstance) {
        return clientInstance;
    }
    clientInstance = await redis
        .createClient()
        .on('error', (err) => console.log('Redis Client Error', err))
        .connect();
    console.log('Redis connected successfully...');
    return clientInstance;
};

const storeDataOnRedis = async (key, data, storeDay = 2) => {
    if (!isProd) return;
    const client = await connectRedis();
    await client.set(key, JSON.stringify(data), {
        EX: 60 * 60 * 24 * (storeDay || 2)
    });
    console.log('redis success', key);
};
const clearRedis = () => {
    clientInstance.flushdb((err, succeeded) => {
        console.log(succeeded); // will be true if success
        clientInstance.disconnect();
    });
};

const getDataByKey = async (key) => {
    if (!isProd) return null;
    try {
        const client = await connectRedis();
        const info = await client.get(key);
        if (info) {
            return JSON.parse(info);
        }
        return null;
    } catch (e) {}
    return null;
};
module.exports = {
    connectRedis,
    storeDataOnRedis,
    clearRedis,
    getDataByKey
};
