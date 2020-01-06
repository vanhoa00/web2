const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
  all: () => db.load('select * from products where status_pro = 1'),
  admin_single: id => db.load(`select * from products where id_pro = ${id}`),
  single: id => db.load(`select * from products where id_pro = ${id} and status_pro = 1`),
  add: entity => db.add('products', entity),
  admin_product: () => db.load(`SELECT p.*, cat.name name_cat FROM products p JOIN categories cat on p.id_cat=cat.id`),
  update_stt: proId => db.update_stt('products', {id_pro : proId}),
  del: proId => db.del('products', {id_pro : proId}),
  detail: id_pro => db.load(`select p.*,  u2.name winner, u2.id id_winner, u1.name seller from products p, users u1, users u2 where p.id_sel = u1.id and p.id_pro = ${id_pro} and p.id_winner = u2.id`),
  relate: id_cat => db.load(`select * from products where id_cat = ${id_cat} and status_pro = 1 limit 5`),
  bidding: entity => db.add('bidding_history', entity),
  update_price: entity => {
    const inf = { current_price: entity.price, id_winner: entity.id};
  	const id_pro = {id_pro: entity.id_pro};
  	db.update_price('products', inf, id_pro);
  },
  search: (id_cat, key) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1`),
  totalSeach: (id_cat, key) => db.load(`select count(*) as total from products where name_pro like '%${key}%'${id_cat} and status_pro = 1`),
  pageBySearch: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1 limit ${config.paginate.limit} offset ${offset}`),
  // Price up, down
  priceAsc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1 ORDER by current_price ASC limit ${config.paginate.limit} offset ${offset}`),
  priceDesc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1 ORDER by current_price DESC limit ${config.paginate.limit} offset ${offset}`),
  // Date up. downw
  dateAsc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1 ORDER by time_start ASC limit ${config.paginate.limit} offset ${offset}`),
  dateDesc: (id_cat, key, offset) => db.load(`select * from products where name_pro like '%${key}%'${id_cat} and status_pro = 1 ORDER by time_start DESC limit ${config.paginate.limit} offset ${offset}`),

  getID: () => db.load(`SELECT MAX(id_pro) id FROM products`),
  getCategory: id_cat => db.load(`select * from products where id_cat = ${id_cat} and status_pro = 1`),
  getMyProduct: id => db.load(`select * from products where id_sel = ${id}`),
  getMyAuction: id => db.load(`SELECT * FROM bidding_history bh, products p WHERE bh.id = ${id} and bh.id_pro = p.id_pro GROUP by id, bh.id_pro`),
  getMyWonlist: id => db.load(`SELECT * FROM products WHERE id_winner = ${id} and status_pro = 0`),
  getCountBidding: id_pro => db.load(`SELECT COUNT(*) count_bidding FROM bidding_history WHERE id_pro = ${id_pro} GROUP BY id_pro`),
  getTop1: id_pro => db.load(`SELECT u.name top1 FROM products p, users u WHERE p.id_winner = u.id and p.id_pro = ${id_pro}`),
    

  allByCat: id_cat => db.load(`select * from products where id_cat = ${id_cat} and status_pro = 1`),
  countByCat: async id_cat => {
    const rows = await db.load(`select count(*) as total from products where id_cat = ${id_cat} and status_pro = 1`)
    return rows[0].total;
  },
  pageByCat: (id_cat, offset) => db.load(`select * from products where id_cat = ${id_cat} and status_pro = 1 limit ${config.paginate.limit} offset ${offset}`),

  totalProduct: async () => {
    const rows = await db.load(`select count(*) as total from products where status_pro = 1`)
    return rows[0].total;
  },
  pageByProduct: offset => db.load(`select * from products where status_pro = 1 limit ${config.paginate.limit} offset ${offset}`),

  top5product: () => db.load(`SELECT p.*, count(bh.id_pro) as qty FROM bidding_history bh JOIN products p on bh.id_pro= p.id_pro where p.status_pro = 1 GROUP BY bh.id_pro ORDER BY qty DESC LIMIT 5`),
  top5price: () => db.load(`SELECT * FROM products WHERE status_pro = 1 ORDER BY current_price DESC LIMIT 5`),
  top5date: () => db.load(`SELECT * FROM products WHERE status_pro = 1 ORDER BY time_end ASC LIMIT 5`),

  // update description
  update_des: entity => {
    const condition = { id_pro: entity.id_pro };
    delete entity.id_pro;
    entity.description = entity.description + entity.description_new;
    delete entity.description_new;
    return db.patch('products', entity, condition);
  },
  buynow: entity => {
    const condition = { id_pro: entity.id_pro };
    delete entity.id_pro;
    return db.patch('products', entity, condition);
  },
};
