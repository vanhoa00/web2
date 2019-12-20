const db = require('../utils/db');

module.exports = {
  all: () => db.load('select * from categories'),
  single: id => db.load(`select * from categories where id = ${id}`),
  add: entity => db.add('categories', entity)
};