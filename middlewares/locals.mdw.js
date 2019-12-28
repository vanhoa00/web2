const funcModel = require('../models/func.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {
    const level1 = await funcModel.all_parent();
    const level2 = await funcModel.all_child();

    res.locals.listfunc = level1;
    res.locals.detailfunc = level2;

    if (typeof (req.session.isAuthenticated) === 'undefined') {
      req.session.isAuthenticated = false;
    }

    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.authUser = req.session.authUser;

    next();
  })
};

// module.exports = async (req, res, next) => {
//   const rows = await categoryModel.allWithDetails();
//   res.locals.lcCategories = rows;
//   next();
// }

