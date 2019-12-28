const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from products'),
  single: id => db.load(`select * from products where id_pro = ${id}`),
  add: entity => db.add('products', entity),
  update_stt: proId => db.update_stt('products', {id_pro : proId}),
  del: proId => db.del('products', {id_pro : proId}),
  detail: id => db.load(`select * from products, product_detail, users where products.id_pro = product_detail.id_pro && product_detail.id_sel = users.id && products.id_pro = ${id}`),
  relate: () => db.load(`select * from products limit 4`),
  bidding: entity => db.add('bidding_history', entity),
  update_price: entity => {
  	const current_price = { current_price: entity.price };
  	const id_pro = {id_pro: entity.id_pro};
  	db.update_price('product_detail', current_price, id_pro);
  },
  search: key => db.load(`select * from products where name_pro like '%${key}%'`),
};
