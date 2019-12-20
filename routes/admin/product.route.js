const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await productModel.all();
  res.render('vwProducts/index', {
    products: rows,
    empty: rows.length === 0
  });
})

router.get('/add', (req, res) => {
  res.render('vwProducts/add');
})

router.post('/add', async (req, res) => {
  const result = await productModel.add(req.body);
  // console.log(result.insertId);
  res.render('vwProducts/add');
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/edit/:id', async (req, res) => {
  const rows = await productModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid product id');
  }
  res.render('vwProducts/edit', {
    product: rows[0]
  });
})

router.post('/patch', async (req, res) => {
  const result = await productModel.patch(req.body);
  res.redirect('/admin/products');
})

router.post('/del', async (req, res) => {
  const result = await productModel.del(req.body.CatID);
  // console.log(result.affectedRows);
  res.redirect('/admin/products');
})

module.exports = router;