const express = require('express');
const productModel = require('../../models/product.model');
const userModel = require('../../models/user.model');
const moment = require('moment');

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await productModel.all();
  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')){
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  res.render('home', {
    products: rows,
    empty: rows.length === 0,
  });
})

router.post('/', async (req, res) => {
  const rows = await productModel.search(req.body.key);
  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')){
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  res.render('home', {
    products: rows,
    empty: rows.length === 0
  });
})


router.get('/product/:id', async (req, res) => {
  const rows = await productModel.detail(req.params.id);
  const temp = await productModel.relate(rows[0].id_cat);
  const history = await userModel.getHistory(req.params.id);

  for (var i = temp.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(temp[i].time_start).add(24, 'hours'), 'hours')){
      temp[i].isnew = true;
    }
    else {
      temp[i].isnew = false;
    }
  }
  
  if(res.locals.isAuthenticated){
    const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, req.params.id);
    if (rows.length === 0) {
      throw new Error('Invalid product id');
    }
    if(checkWatchList.length == 0){
      res.render('user/productDetail', {
        product: rows[0],
        relate: temp,
        history: history,
        watchlist:'1',
      });
    }
    else {
      res.render('user/productDetail', {
        product: rows[0],
        history: history,
        relate: temp
      });    
    }
  }
  else {
    res.render('user/productDetail', {
      product: rows[0],
      history: history,
      relate: temp
    }); 
  }
})

router.post('/product/:id', async (req, res) => {
  const temp = await productModel.detail(req.params.id);
  const temp1 = await productModel.relate(temp[0].id_cat);
  for (var i = temp1.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(temp1[i].time_start).add(24, 'hours'), 'hours')){
      temp1[i].isnew = true;
    }
    else {
      temp1[i].isnew = false;
    }
  }
  if(req.body.price < temp[0].current_price || req.body.price > temp[0].buynow_price){
    return res.render('user/productDetail', {
      product: temp[0],
      relate: temp1,
      err_message: 'Giá đưa ra phải cao hơn giá hiện tại và thấp hơn giá mua ngay'
    });
  }
  else {
    const entity = req.body;
    entity.id_pro = req.params.id;
    entity.price = req.body.price;
    entity.id = req.session.authUser.id;

    const rows = await productModel.bidding(entity);
    delete entity.id;
    const temp2 = await productModel.update_price(entity);
    res.render('user/productDetail', {
      product: temp[0],
      relate: temp1,
    });
  }

})

router.post('/search', async (req, res) => {
  if(req.body.id_cat == -1) req.body.id_cat ="";
  else req.body.id_cat = " and id_cat = " + req.body.id_cat;

  const rows = await productModel.search(req.body.id_cat, req.body.key);
  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')){
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  console.log(rows);
  res.render('search', {
    products: rows,
    empty: rows.length === 0
  });
})

router.get('/categories/:id', async (req, res) => {
  const rows = await productModel.getCategory(req.params.id);
  console.log(rows);
  res.render('home', {
    products: rows,
    empty: rows.length === 0,
  });
})


module.exports = router;