const restrict = require('../middlewares/auth.mdw');

module.exports = function (app) {

	app.use('/admin/categories', require('../routes/admin/category.route'));

	app.use('/admin/products', require('../routes/admin/product.route'));

	app.use('/', require('../routes/user/product.route'));

	app.use('/user', require('../routes/user/Account.route'));

};

