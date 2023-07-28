const { pgp, db } = require('@/connection/index.js');

async function doesRecordExist(storeId) {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in the format 'YYYY-MM-DD'
    const checkResult = await db.any(
        'SELECT id FROM goods_prices WHERE store_id = $1 AND timestamp::date = $2',
        [storeId, today]
    );
    return checkResult.length > 0;
}

const recordPriceByStoreId = async ({ goodsData = [], storeId }) => {
    // await db.none('DELETE FROM goods_prices WHERE store_id = $1', storeId);
    const recordExists = await doesRecordExist(storeId);
    if (recordExists) {
        console.log(
            'A record with the same store and goods for today already exists.'
        );
        return;
    }
    if (goodsData?.length === 0) return;
    try {
        const cs = new pgp.helpers.ColumnSet(
            ['store_id', 'store_name', 'month_sell', 'price', 'goods_name'],
            {
                table: 'goods_prices'
            }
        );
        // data input values:
        const values = goodsData?.map?.((goods) => {
            return {
                store_id: Number(goods.storeId),
                store_name: goods.storeName,
                month_sell: Number(goods.monthSell || 0),
                price: Number(goods.currentPrice),
                goods_name: goods.name
            };
        });
        // generating a multi-row insert query:
        const query = pgp.helpers.insert(values, cs);
        //=> INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')

        // executing the query:
        await db.none(query);
        //ctx.body = 'Bulk insert successful.';
        return 200;
    } finally {
        console.log('finish it');
    }
    return 200;
};

const fetchGoodsPriceRecord = async ({ storeId, name }) => {
    const checkResult = await db.any(
        'SELECT * FROM goods_prices WHERE store_id = $1 AND goods_name = $2',
        [storeId, name]
    );
    console.log('checkResult :>> ', checkResult);
    return checkResult;
};

module.exports = {
    recordPriceByStoreId,
    fetchGoodsPriceRecord
    //queryAddressList
};
