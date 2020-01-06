const db = require('../utils/db');


module.exports = {
  all: () => db.load('select * from categories'),
  single: id => db.load(`select * from categories where id = ${id}`),
  add: entity => db.add('categories', entity),
  del: cat_id => db.del('categories', { id: cat_id }),
  patch: entity => {
    const condition = { id: entity.id };
    delete entity.id;
    console.log(condition, entity);
    return db.patch('categories', entity, condition);
  },

  cat_lv1: () => db.load('select * from categories where id_parent = 0'),
  cat_lv2: () => db.load('select * from categories where id_parent <> 0'),

  // allWithDetails: _ => {
  //   const sql = `
  //     select c.id, c.name, count(p.id_pro) as num_of_products
  //     from categories c left join products p on c.id = p.id_cat
  //     group by c.id, c.name`;
  //   return db.load(sql);
  // },
};