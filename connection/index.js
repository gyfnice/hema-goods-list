const Pool = require("pg").Pool;
const pool = new Pool({
  user: "gyfnice",
  host: "dpg-cin6gplph6evlas96v90-a.singapore-postgres.render.com",
  database: "eleshop",
  password: "iBOpEB8bC2oDwcj2lipdlbCVvCQMSIi3",
  port: 5432,
  ssl: true
});
const getCookie = async (request, response) => {
  const result = await pool.query("SELECT * FROM cookies ORDER BY id ASC");
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
  getCookie,
  updateCookie
};