const express = require('express');
const productModel = require('../../models/product.model');
const userModel = require('../../models/user.model');
const config = require('../../config/default.json');
const moment = require('moment');
const router = express.Router();

let id_cat;
let key;
router.post('/', async (req, res) => {
    // if(req.body.id_cat == -1) req.body.id_cat ="";
    // else req.body.id_cat = " and id_cat = " + req.body.id_cat;
  
    // // const rows = await productModel.pageBySearch(req.body.id_cat, req.body.key, offset);
    // const limit = config.paginate.limit;
    // const page = req.query.page || 1;
    // if (page < 1) page = 1;
    // const offset = (page - 1) * config.paginate.limit;
    // const [total, rows] = await Promise.all([
    //   productModel.totalSeach(req.body.id_cat, req.body.key), // Số lượng sản phẩm
    //   productModel.pageBySearch(req.body.id_cat, req.body.key, offset) // Số lượng sản phẩm mỗi trang
    // ]);
    // //
    // id_cat = req.body.id_cat;
    // key = req.body.key;

    // for (var i = rows.length - 1; i >= 0; i--) {
    //   const now = moment().startOf('second');
    //   if(moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')){
    //     rows[i].isnew = true;
    //   }
    //   else {
    //     rows[i].isnew = false;
    //   }
    // }
    // let nPages = Math.floor(total[0].total / limit);
    // if (total % limit > 0) nPages++;
    // const page_numbers = [];
    // for (i = 1; i <= nPages; i++) {
    //   page_numbers.push({
    //     value: i,
    //     isCurrentPage: i === +page
    //   })
    // }
    // var prev_value = +page - 1;
    // if(prev_value === 0)
    //   prev_value = 1;
    // const next_value = +page + 1;
    //console.log(rows);
    // res.render('user/vwProducts/search', {
    //   products: rows,
    //   empty: rows.length === 0,
    //   page_numbers,
    //   prev_value,
    //   next_value,
    // });
})

router.get('/', async (req, res) => {
  id_cat = req.query.id_cat;
  key = req.query.key;
  if(req.query.id_cat == -1) req.query.id_cat ="";
  else req.query.id_cat = " and id_cat = " + req.query.id_cat;

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

  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if(moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')){
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  let nPages = Math.floor(total[0].total / limit);
  if (total[0].total % limit > 0) nPages++;
  console.log(nPages);
  const page_numbers = [];
  for (i = 1; i <= nPages; i++) {
    page_numbers.push({
      value: i,
      isCurrentPage: i === +page
    })
  }
  var prev_value = +page - 1;
  if(prev_value === 0)
    prev_value = 1;
  const next_value = +page + 1;
  res.render('user/vwProducts/search', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value,
    next_value,
    id : id_cat,
    key: key,
  });
})



router.post('/sort', async (req, res) => {
  const methodSort = req.body.sort;
  const limit = config.paginate.limit;
  console.log(limit);
  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;
  var total, rows;

  if(methodSort == 1){
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.priceAsc(id_cat, key, offset)
    ]);
  }
  else if(methodSort == 2){
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.priceDesc(id_cat, key, offset)
    ]);
  }
  else if(methodSort == 3){
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.dateAsc(id_cat, key, offset)
    ]);
  }
  else if(methodSort == 4){
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key),
      productModel.dateDesc(id_cat, key, offset)
    ]);
  }
  else{
    [total, rows] = await Promise.all([
      productModel.totalSeach(id_cat, key), // Số lượng sản phẩm
      productModel.pageBySearch(id_cat, key, offset) // Số lượng sản phẩm mỗi trang
    ]);
  }
  console.log(total[0]);
  console.log(limit);
  let nPages = Math.floor(total[0].total / limit);
  console.log(nPages);
    if (total % limit > 0) nPages++;
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        isCurrentPage: i === +page
      })
    }
    var prev_value = +page - 1;
    if(prev_value === 0)
      prev_value = 1;
    const next_value = +page + 1;
  res.render('user/vwProducts/search', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value,
    next_value,
  });
})

module.exports = router;