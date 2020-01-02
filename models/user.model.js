const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from users'),
  single: id => db.load(`select * from users where id = ${id}`),
  singleByUsername: async username => {
    const rows = await db.load(`select * from users where username = '${username}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  add: entity => db.add('users', entity),
  del: user_id => db.del('users', { id: user_id }),

  patch: entity => {
    const condition = { id: entity.id };
    return db.patch('users', entity, condition);
  },
  updatePassWord: entity => {
    const id = { id: entity.id };
    const password = {password: entity.password};
    db.update_password('users', id, password);
  },
  upgrade_list: () => db.load('select * from users where Permission = 2'),
  upgrade: user_id => db.upgrade('users', { id: user_id }),
  downgrade: user_id => db.downgrade('users', { id: user_id }),
  addWatchList: entity => db.add('watch_list', entity),
  delWatchList: entity => db.del('watch_list', entity),
  getWatchList: id => db.load(`SELECT * FROM watch_list wl, products p WHERE wl.id_pro = p.id_pro and id = ${id}`),
  checkUserName: username => db.load(`select * from users where username = ${username}`),
  checkPhone: Phone => db.load(`select * from users where Phone = ${username}`),
  checkWatchList: id_pro => db.load(`select * from watch_list where id_pro = ${id_pro}`),

};
