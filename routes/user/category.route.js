const express = require('express');
const productModel = require('../../models/product.model');
const categoryModel = require('../../models/category.model');
const config = require('../../config/default.json');
const router = express.Router();


router.get('/:id', async (req, res) => {

  const catId = req.params.id;
  const limit = config.paginate.limit;

  const page = req.query.page || 1;
  if (page < 1) page = 1;
  const offset = (page - 1) * config.paginate.limit;

  const [total, rows] = await Promise.all([
    productModel.countByCat(catId), // Số lượng sản phẩm theo danh mục
    productModel.pageByCat(catId, offset) // Số lượng sản phẩm mỗi trang
  ]);

  // const total = await productModel.countByCat(catId);
  let nPages = Math.floor(total / limit);
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

  // const rows = await productModel.pageByCat(catId, offset);
  res.render('user/vwProducts/allByCat', {
    products: rows,
    empty: rows.length === 0,
    page_numbers,
    prev_value,
    next_value,
  });
})

module.exports = router;