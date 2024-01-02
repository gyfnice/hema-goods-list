const connectionConfig = {
    user: 'elegoods2_user',
    host: 'dpg-cm9mlfed3nmc73cs524g-a.singapore-postgres.render.com',
    database: 'elegoods2',
    password: '7f3mgtuA3fjNegLkAKd4KDagbDKqZWiR',
    port: 5432,
    ssl: true
};
const pgp = require('pg-promise')({
    /* initialization options */
    capSQL: true // capitalize all generated SQL
});
const db = pgp(connectionConfig);
const Pool = require('pg').Pool;
const pool = new Pool(connectionConfig);
const getCookie = async (request, response) => {
    const result = await pool.query('SELECT * FROM cookies ORDER BY id ASC');
    return result.rows[0].cookie_value;
};
const updateCookie = async (cookie) => {
    const res = await pool.query(
        `UPDATE cookies SET cookie_value = $1 WHERE gyf_token = 'gyfnice'`,
        [cookie]
    );
    return res;
};

module.exports = {
    pgp,
    db,
    pool,
    getCookie,
    updateCookie
};
