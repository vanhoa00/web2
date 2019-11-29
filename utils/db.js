const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'qlbh'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),

  // load: sql => new Promise((done, fail) => {
  //   pool.query(sql, (error, results, fields) => {
  //     if (error) {
  //       fail(error);
  //     } else {
  //       done(results);
  //     }
  //   });
  // })

  // load: (sql, fn_done) => {
  //   var connection = mysql.createConnection({
  //     host: 'localhost',
  //     port: 8889,
  //     user: 'root',
  //     password: 'root',
  //     database: 'qlbh'
  //   });

  //   connection.connect();
  //   connection.query(sql, (error, results, fields) => {
  //     if (error)
  //       throw error;
  //     fn_done(results);
  //     connection.end();
  //   });
  // }
};
