const express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();


router.get('/', async (req, res) => {

  // const pr = db.load('select * from categories1');
  // pr.then(rows => {
  //   res.render('vwCategories/index', {
  //     categories: rows,
  //     empty: rows.length === 0
  //   });
  // }).catch(err => {
  //   console.log(err);
  //   res.end('View error log in console.');
  // });
  // 
  const list = [
    {CatID: 1, CatName: 'Laptop Gaming Asus ROG Strix SCAR GL503GE-EN021T', CatPrice: '22.000.000'},
    {CatID: 2, CatName: 'Laptop ROG Strix SCAR ', CatPrice: '25.000.000'},
    {CatID: 3, CatName: 'Laptop ROG Strix SCAR GL503GE-EN021T', CatPrice: '21.000.000'},
    {CatID: 4, CatName: 'Asus ROG Zephyrus GA502DU-738G512S6G', CatPrice: '29.990.000'},
    {CatID: 5, CatName: 'Lenovo Legion Y7000-15IRH (81V4000AVN)', CatPrice: '20.890.000'},
  ]
  res.render('vwCategories/index', {
    categories: list
  })
  // res.render('home', {
  //   categories: list
  // })

  // try {
  //   // const rows = await db.load('select * from categories');
  //   const rows = await categoryModel.all();
  //   res.render('vwCategories/index', {
  //     categories: rows,
  //     empty: rows.length === 0
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.end('View error log in console.');
  // }


  // db.load('select * from categories', rows => {
  //   res.render('vwCategories/index', {
  //     categories: rows,
  //     empty: rows.length === 0
  //   });
  // });
})

module.exports = router;