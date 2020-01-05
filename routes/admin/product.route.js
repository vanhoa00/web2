const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await productModel.all();
  res.render('backend/vwProducts/index', {
    products: rows,
    empty: rows.length === 0
  });
})

router.get('/err', (req, res) => {
  throw new Error('error occured');
})
router.get('/view/:id', async (req, res) => {
  const rows = await productModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid product id');
  }
  res.render('backend/vwProducts/view', {
    product: rows[0]
  });
})

router.post('/del', async (req, res) => {
  const result = await productModel.del(req.body.proID);
  //console.log(req.body);
  res.redirect('/admin/products');
})

router.post('/update_stt', async (req, res) => {
  const result = await productModel.update_stt(req.body.proID);
  res.redirect('/admin/products');
})
module.exports = router;