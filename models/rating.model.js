const db = require('../utils/db');
const config = require('../config/default.json');

module.exports = {
    add: entity => db.add('ratings', entity),
};