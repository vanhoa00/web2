const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await categoryModel.all();
  res.render('vwCategories/index', {
    categories: rows,
    empty: rows.length === 0
  });
})

router.get('/add', (req, res) => {
  res.render('vwCategories/add');
})

router.post('/add', async (req, res) => {
  const result = await categoryModel.add(req.body);
  //console.log(result.insertId);
  res.render('vwCategories/add');
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/edit/:id', async (req, res) => {
  const rows = await categoryModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid category id');
  }
  res.render('vwCategories/edit', {
    category: rows[0]
  });
})

router.post('/patch', async (req, res) => {
  const result = await categoryModel.patch(req.body);
  res.redirect('/admin/categories');
})

router.post('/del', async (req, res) => {
  const result = await categoryModel.del(req.body.id);
  // console.log(result.affectedRows);
  res.redirect('/admin/categories');
})

module.exports = router;