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
  updateProfile: (entity, username)=> db.update_profile('users', entity, username),  
  upgrade_list: () => db.load('select * from users where Permission = 2'),
  upgrade: user_id => db.upgrade('users', { id: user_id }),
  upgrade_suggest: user_id => db.upgrade_suggest('users', { id: user_id }),
  downgrade: user_id => db.downgrade('users', { id: user_id }),
  addWatchList: entity => db.add('watch_list', entity),
  delWatchList: condition => db.del_watchlist(condition.id, condition.id_pro),
  getWatchList: id => db.load(`SELECT * FROM watch_list wl, products p WHERE wl.id_pro = p.id_pro and wl.id = ${id}`),
  checkWatchList: (id, id_pro) => db.load(`SELECT * FROM watch_list wl, products p WHERE wl.id_pro = p.id_pro and wl.id = ${id} and wl.id_pro = ${id_pro}`),
  checkUserName: username => db.load(`select * from users where username = '${username}'`),
  checkEmail: email => db.load(`select * from users where email = ${email}`),
  checkPhone: Phone => db.load(`select * from users where Phone = ${Phone}`),
  getHistory: id_pro => db.load(`SELECT * FROM users u, bidding_history b WHERE u.id = b.id and b.id_pro = ${id_pro}`),
  getRating: username => db.load(`SELECT r.*, u.username person_rating FROM ratings r, users u WHERE r.id_person_rating = u.id and r.username = '${username}'`),
  getAVGRating: username => db.load(`SELECT AVG(mark) avg FROM ratings WHERE username = '${username}'`),
};
