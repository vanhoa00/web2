const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'auctions'  
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  del: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, condition),
  update_password: (tableName, id, password) => mysql_query(`update ${tableName} set ? where ?`, [password, id]),
  update_stt: (tableName, condition) => mysql_query(`update ${tableName} set status = 2 where ?`, condition),
  update_price: (tableName, current_price, id_pro) => mysql_query(`update ${tableName} set ? where ?`, [current_price, id_pro]),
  patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),

  upgrade: (tableName, condition) => mysql_query(`update ${tableName} set Permission = 1 where ?`, condition),
  downgrade: (tableName, condition) => mysql_query(`update ${tableName} set Permission = 0 where ?`, condition),
};
