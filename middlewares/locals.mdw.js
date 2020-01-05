const funcModel = require('../models/func.model');
const catModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async (req, res, next) => {

    //admin
    const level1 = await funcModel.all_parent();
    res.locals.listfunc = level1;

    //user
    const cat_lv1 = await catModel.cat_lv1();
    const cat_lv2 = await catModel.cat_lv2();
  

    res.locals.listCat = cat_lv1;
    res.locals.detailCat = cat_lv2;

    if (typeof (req.session.isAuthenticated) === 'undefined') {
      req.session.isAuthenticated = false;
      req.session.isAdmin = false;
    }
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.authAdmin = req.session.authAdmin;

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

