const restrict = require('../middlewares/auth.mdw');
const restrict_admin = require('../middlewares/admin.mdw');


module.exports = function (app) {

	app.use('/admin/categories',restrict_admin, require('../routes/admin/category.route'));

	app.use('/admin/products', restrict_admin, require('../routes/admin/product.route'));

	app.use('/admin/users', restrict_admin, require('../routes/admin/user.route'));

	app.use('/admin', require('../routes/admin/admin.route'));

	app.use('/', require('../routes/user/product.route'));

	app.use('/search', require('../routes/user/search.route'));

	app.use('/categories', require('../routes/user/category.route'));

	app.use('/user', require('../routes/user/Account.route'));

};

