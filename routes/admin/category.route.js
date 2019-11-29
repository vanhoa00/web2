const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async (req, res) => {

  // const pr = db.load('select * from categories1');
  // pr.then(rows => {
  //   res.render('vwCategories/index', {
  //     categories: rows,
  //     empty: rows.length === 0
  //   });
  // }).catch(err => {
  //   console.log(err);
  //   res.end('View error log in console.');
  // });

  try {
    // const rows = await db.load('select * from categories');
    const rows = await categoryModel.all();
    res.render('vwCategories/index', {
      categories: rows,
      empty: rows.length === 0
    });
  } catch (err) {
    console.log(err);
    res.end('View error log in console.');
  }


  // db.load('select * from categories', rows => {
  //   res.render('vwCategories/index', {
  //     categories: rows,
  //     empty: rows.length === 0
  //   });
  // });
})

module.exports = router;