const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from categories'),
  single: id => db.load(`select * from categories where id = ${id}`),
  add: entity => db.add('categories', entity),
  del: condition => db.del('categories', condition),
  patch: entity => {
    const condition = { id: entity.id };
    delete entity.id;
    console.log(condition, entity);
    return db.patch('categories', entity, condition);
  }
};