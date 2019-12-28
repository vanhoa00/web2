const db = require('../utils/db');

module.exports = {
  all_parent: () => db.load('select * from funcs where id_parent = 0'),
  all_child: () => db.load('select * from funcs where id_parent <> 0'),
};