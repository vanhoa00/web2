const express = require('express');
const bcrypt = require('bcryptjs');
const validator = require("email-validator");
const adminModel = require('../../models/admin.model');
const productModel = require('../../models/product.model');

const router = express.Router();



// router.get('/register', async (req, res) => {
//   res.render('admin/Register');
// })

// router.post('/register', async (req, res) => {
//   if(req.body.adminname == ""){
//     return res.render('admin/Register', {
//       err_message: 'Invalid adminname'
//     });
//   };
//   if(req.body.name == "" || req.body.Phone == ""){
//     return res.render('admin/Register', {
//       err_message: 'Invalid Name or Phone'
//     });
//   };
//   if(validator.validate(req.body.Email) === false){
//     return res.render('admin/Register', {
//       err_message: 'Invalid Email'
//     });
//   };
//   // if(req.body.Phone.length() != 10 || req.body.Phone.length() != 11){
//   //   return res.render('admin/Register', {
//   //     err_message: 'Invalid Phone'
//   //   });
//   // };

//   if(req.body.raw_password != req.body.repass){
//     return res.render('admin/Register', {
//       err_message: 'Invalid Password'
//     });
//   };

//   const N = 10;
//   const hash = bcrypt.hashSync(req.body.raw_password, N);
//   const DateOfBirth = moment(req.body.DateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');

//   const entity = req.body;
//   entity.password = hash;
//   entity.DateOfBirth = DateOfBirth;
//   entity.Permission = 0;

//   delete entity.raw_password;
//   delete entity.repass;
//   const result = await adminModel.add(entity);
//   res.render('admin/Register');
// });

// router.get('/profile', async (req, res) => {
//   res.render('admin/profile');
// })


// router.get('/sellproduct', async (req, res) => {
//   res.render('admin/sellProduct');
// })

// router.post('/sellproduct', async (req, res) => {
//   const getID = await productModel.getID();
//   var files;
//   temp = 1;

//   ID = getID[0].id + 1;
//   upload.array('fuMain', 3)(req, res, err => {
//     files = req.files;
//     if(files.length != 3)
//     {
//       return res.render('admin/sellProduct', {
//         err_message: 'Invalid files'
//       });
//     }
//     else {
//       console.log(req.body);
//       // const name_pro = req.body.name_pro;
//       // const current_price = req.body.bidPrice;
//       // const buynow_price = req.body.buynow_price;
//       // const description = req.body.description;
//       // const time_start = '2019-12-25 00:00:00';
//       // const time_end = '2020-01-25 00:00:00';

//       // const insert = req.body;
//       // delete insert.bidPrice;
//       // delete insert.buocGia;
//       // insert.current_price = current_price;
//       // insert.id_sel = res.locals.authadmin.id;
//       // insert.time_start = time_start;
//       // insert.time_end = time_end;
//       // console.log(insert);

//       //const result = productModel.add(insert);

//       const insert = req.body;
//       delete insert.buocGia;
//       insert.id_sel = res.locals.authadmin.id;
//       insert.time_start = '2019-12-25 00:00:00';
//       insert.time_end = '2020-01-25 00:00:00';
//       insert.status_pro = 1;

//       const result = productModel.add(insert);

//       res.render('admin/sellProduct');
//     }
//   });
// })

router.get('/login', async (req, res) => {
  res.render('vwAdmin/Login');
});

router.post('/login', async (req, res) => { 
  const admin = await adminModel.singleByAdminname(req.body.username);
  if (admin === null){
    return res.render('vwAdmin/Login', {
      err_message: 'Invalid adminname or password.'
    });
  }
  const rs = bcrypt.compareSync(req.body.password, admin.password);
  if (rs === false){
   return res.render('vwAdmin/Login', {
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
  res.redirect('/admin/login');
});


module.exports = router;