const express = require('express');
const bcrypt = require('bcryptjs');
const validator = require("email-validator");
const adminModel = require('../../models/admin.model');
const productModel = require('../../models/product.model');

const router = express.Router();



router.get('/', async (req, res) => {
  res.render('backend/vwAdmin/Login');
})

router.post('/', async (req, res) => { 
  const admin = await adminModel.singleByAdminname(req.body.username);
  if (admin === null){
    return res.render('backend/vwAdmin/Login', {
      err_message: 'Invalid adminname or password.'
    });
  }
  const rs = bcrypt.compareSync(req.body.password, admin.password);
  if (rs === false){
   return res.render('backend/vwAdmin/Login', {
    err_message: 'Login failed'
  });
 }

 delete admin.password;

 req.session.isAdmin = true;
 req.session.authAdmin = admin;

 console.log(admin);

 const url = req.query.retUrl || '/admin/products';
 res.redirect(url);
});

router.post('/logout', (req, res) => {
  req.session.isAdmin = false;
  req.session.authAdmin = null;
  res.redirect('backend/admin/login');
});


module.exports = router;