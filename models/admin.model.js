const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from admins'),
  single: id => db.load(`select * from admins where id = ${id}`),
  singleByAdminname: async username => {
    const rows = await db.load(`select * from admins where username = '${username}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  add: entity => db.add('admins', entity),
  del: user_id => db.del('admins', { id: user_id }),

//   patch: entity => {
//     const condition = { id: entity.id };
//     //delete entity.id;
//     //console.log(condition, entity);
//     return db.patch('admins', entity, condition);
//   },

//   upgrade_list: () => db.load('select * from admins where Permission = 2'),
//   upgrade: user_id => db.upgrade('admins', { id: user_id }),
//   downgrade: user_id => db.downgrade('admins', { id: user_id }),
};
