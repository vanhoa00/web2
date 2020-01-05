const mysql = require('mysql');
const util = require('util');
const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql);
const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  del: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, condition),
  del_watchlist: (id, id_pro) => mysql_query(`delete from watch_list where id = ${id} and id_pro = ${id_pro}`),
  update_password: (tableName, id, password) => mysql_query(`update ${tableName} set ? where ?`, [password, id]),
  update_profile: (tableName, entity, username) => mysql_query(`update ${tableName} set ? where username = '${username}'`, entity),
  update_stt: (tableName, condition) => mysql_query(`update ${tableName} set status = 2 where ?`, condition),
  update_price: (tableName, inf, id_pro) => mysql_query(`update ${tableName} set ? where ?`, [inf, id_pro]),
  patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),

  upgrade: (tableName, condition) => mysql_query(`update ${tableName} set Permission = 1 where ?`, condition),
  upgrade_suggest: (tableName, condition) => mysql_query(`update ${tableName} set Permission = 2 where ?`, condition),
  downgrade: (tableName, condition) => mysql_query(`update ${tableName} set Permission = 0 where ?`, condition),
};
