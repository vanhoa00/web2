const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await productModel.all();
  res.render('home', {
    products: rows,
    empty: rows.length === 0,
  });
})

router.post('/', async (req, res) => {
  const rows = await productModel.search(req.body.key);
  res.render('home', {
    products: rows,
    empty: rows.length === 0
  });
})

router.post('/', async (req, res) => {
  const rows = await productModel.search(req.body.key);
  res.render('home', {
    products: rows,
    empty: rows.length === 0
  });
})


router.get('/product/:id', async (req, res) => {
  const rows = await productModel.detail(req.params.id);
  const temp = await productModel.relate();
  if (rows.length === 0) {
    throw new Error('Invalid product id');
  }
  res.render('user/productDetail', {
    product: rows[0],
    relate: temp
  });
})

router.post('/product/:id', async (req, res) => {
  const entity = req.body;
  entity.id_pro = req.params.id;
  entity.price = req.body.price;
  entity.id = req.session.authUser.id;

  const rows = await productModel.bidding(entity);
  const temp = await productModel.detail(req.params.id);
  const temp1 = await productModel.relate();
  delete entity.id;
  console.log(entity);

  const temp2 = await productModel.update_price(entity);

  res.render('user/productDetail', {
    product: temp[0],
    relate: temp1
  });
})

router.post('/search', async (req, res) => {
  if(req.body.id_cat == -1) req.body.id_cat ="";
  else req.body.id_cat = " and id_cat = " + req.body.id_cat;

  const rows = await productModel.search(req.body.id_cat, req.body.key);
  console.log(rows);
  res.render('search', {
    products: rows,
    empty: rows.length === 0
  });
})



module.exports = router;