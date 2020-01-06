const express = require('express');
const productModel = require('../../models/product.model');
const userModel = require('../../models/user.model');
const config = require('../../config/default.json');
const moment = require('moment');
const router = express.Router();

let id_cat, key, temp;
router.get('/', async (req, res) => {
  temp = req.query.id_cat;
  if (req.query.id_cat == -1) req.query.id_cat = "";
  else req.query.id_cat = " and id_cat = " + req.query.id_cat;

  id_cat = req.query.id_cat;
  key = req.query.key;
  // const rows = await productModel.pageBySearch(req.body.id_cat, req.body.key, offset);
  const limit = config.paginate.limit;
  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  const [total, rows] = await Promise.all([
    productModel.totalSeach(req.query.id_cat, req.query.key), // Số lượng sản phẩm
    productModel.pageBySearch(req.query.id_cat, req.query.key, offset) // Số lượng sản phẩm mỗi trang
  ]);
  //
  // id_cat = req.query.id_cat;
  // key = req.query.key;
  if (res.locals.isAuthenticated) {
    for (var i = rows.length - 1; i >= 0; i--) {
      const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, rows[i].id_pro);
      if (checkWatchList.length === 0) {
        rows[i].watchlist = '1';
      }
    }
  }
  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')) {
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  let nPages = Math.floor(total[0].total / limit);
  if (total[0].total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
    })
  }
  var prev_value = +page - 1;
  if (prev_value === 0)
    prev_value = 1;
  const next_value = +page + 1;
  res.render('user/vwProducts/search', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value,
    next_value,
    id: temp,
    key: key,
  });
})

router.get('/sort', async (req, res) => {
  const methodSort = req.query.sort;
  const limit = config.paginate.limit;

  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  var total, rows;

  if (methodSort == 1) {
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.priceAsc(id_cat, key, offset)
    ]);
  }
  else if (methodSort == 2) {
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.priceDesc(id_cat, key, offset)
    ]);
  }
  else if (methodSort == 3) {
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.dateAsc(id_cat, key, offset)
    ]);
  }
  else if (methodSort == 4) {
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.dateDesc(id_cat, key, offset)
    ]);
  }
  else {
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key), // Số lượng sản phẩm
      productModel.pageBySearch(id_cat, key, offset) // Số lượng sản phẩm mỗi trang
    ]);
  }
  let nPages = Math.floor(total[0].total / limit);
  if (total[0].total % limit > 0) nPages++;
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page,
      _id: temp,
      _key: key,
    })
  }
  var prev_value = +page - 1;
  if (prev_value === 0)
    prev_value = 1;
  const next_value = +page + 1;
  res.render('user/vwProducts/search', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value,
    next_value,
    id: temp,
    key: key,
  });
})

module.exports = router;