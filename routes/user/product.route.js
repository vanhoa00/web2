const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await productModel.all();
  res.render('home', {
    products: rows,
    empty: rows.length === 0
  });
})

router.get('/:id', async (req, res) => {
  const rows = await productModel.detail(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid product id');
  }
  res.render('user/productDetail', {
    product: rows[0]
  });
})


module.exports = router;