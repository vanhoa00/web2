const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await categoryModel.all();
  res.render('backend/vwCategories/index', {
    categories: rows,
    empty: rows.length === 0
  });
})

router.get('/add', async (req, res) => {
  const cat_lv1 = await categoryModel.cat_lv1();
  if (cat_lv1.length === 0) {
    throw new Error('Invalid category id lv1');
  }
  res.render('backend/vwCategories/add',{
    cat_parent: cat_lv1,
  });
})

router.post('/add', async (req, res) => {
  const result = await categoryModel.add(req.body);
  //console.log(result.insertId);
  res.render('backend/vwCategories/add');
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/edit/:id', async (req, res) => {
  const rows = await categoryModel.single(req.params.id);
  const cat_lv1 = await categoryModel.cat_lv1();
  if (rows.length === 0) {
    throw new Error('Invalid category id');
  }
  if (cat_lv1.length === 0) {
    throw new Error('Invalid category id lv1');
  }
  res.render('backend/vwCategories/edit', {
    category: rows[0],
    cat_parent: cat_lv1,
  });
})

router.post('/patch', async (req, res) => {
  const result = await categoryModel.patch(req.body);
  res.redirect('/admin/categories');
})

router.post('/del', async (req, res) => {
  const result = await categoryModel.del(req.body.id);
  //console.log(req.body.id);
  res.redirect('/admin/categories');
})

module.exports = router;