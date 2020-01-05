const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
  all: () => db.load('select * from products'),
  single: id => db.load(`select * from products where id_pro = ${id}`),
  add: entity => db.add('products', entity),
  update_stt: proId => db.update_stt('products', {id_pro : proId}),
  del: proId => db.del('products', {id_pro : proId}),
  detail: id => db.load(`select * from products, users where products.id_sel = users.id && products.id_pro = ${id}`),
  relate: id_cat => db.load(`select * from products where id_cat = ${id_cat} limit 4`),
  bidding: entity => db.add('bidding_history', entity),
  update_price: entity => {
  	const current_price = { current_price: entity.price };
  	const id_pro = {id_pro: entity.id_pro};
  	db.update_price('products', current_price, id_pro);
  },
  search: (id_cat, key) => db.load(`select * from products where name_pro like '%${key}%'${id_cat}`),
  totalSeach: (id_cat, key) => db.load(`select count(*) as total from products where name_pro like '%${key}%'${id_cat}`),
  pageBySearch: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} limit ${config.paginate.limit} offset ${offset}`),
  // Price up, down
  priceAsc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} ORDER by current_price ASC limit ${config.paginate.limit} offset ${offset}`),
  priceDesc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} ORDER by current_price DESC limit ${config.paginate.limit} offset ${offset}`),
  // Date up. downw
  dateAsc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} ORDER by time_start ASC limit ${config.paginate.limit} offset ${offset}`),
  dateDesc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} ORDER by time_start DESC limit ${config.paginate.limit} offset ${offset}`),

  getID: () =>  db.load(`SELECT MAX(id_pro) id FROM products`),
  getCategory: id_cat =>  db.load(`select * from products where id_cat = ${id_cat}`),
  

  allByCat: id_cat => db.load(`select * from products where id_cat = ${id_cat}`),
  countByCat: async id_cat => {
    const rows = await db.load(`select count(*) as total from products where id_cat = ${id_cat}`)
    return rows[0].total;
  },
  pageByCat: (id_cat, offset) => db.load(`select * from products where id_cat = ${id_cat} limit ${config.paginate.limit} offset ${offset}`),

  totalProduct: async () => {
    const rows = await db.load(`select count(*) as total from products`)
    return rows[0].total;
  },
  pageByProduct: offset => db.load(`select * from products limit ${config.paginate.limit} offset ${offset}`),

  top5product: () => db.load(`SELECT p.*, count(bh.id_pro) as qty FROM bidding_history bh JOIN products p on bh.id_pro= p.id_pro GROUP BY bh.id_pro ORDER BY qty DESC LIMIT 5`),
  top5price: () => db.load(`SELECT * FROM products WHERE status_pro = 1 ORDER BY current_price DESC LIMIT 5`),
  top5date: () => db.load(`SELECT * FROM products WHERE status_pro = 1 ORDER BY time_end ASC LIMIT 5`),
};
