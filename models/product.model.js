const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from products'),
  single: id => db.load(`select * from products where id = ${id}`),
  add: entity => db.add('products', entity),
  update_stt: proId => db.update_stt('products', {id : proId}),
  del: proId => db.del('products', {id : proId})
};
