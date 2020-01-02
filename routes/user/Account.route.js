const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer  = require('multer')
const validator = require("email-validator");
var modifyFilename = require('modify-filename');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');

const router = express.Router();
var temp = 1;
var ID = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/images/product`)
  },
  filename: function (req, file, cb) {
    cb(null, ID + '_' + temp + '.jpg')
    temp++;
  }
})
var upload = multer({ storage: storage })


router.get('/register', async (req, res) => {
  res.render('user/Register');
})

router.post('/register', async (req, res) => {
  const checkUsername = await userModel.checkUserName(req.body.username);
  const checkPhone = await userModel.checkUserName(req.body.Phone);
  if(req.body.username == "" || checkUsername.length != 0){
    return res.render('user/Register', {
      err_message: 'Invalid Username'
    });
  };
  if(req.body.name == "" || req.body.Phone == ""){
    return res.render('user/Register', {
      err_message: 'Invalid Name or Phone'
    });
  };
  if(validator.validate(req.body.Email) === false){
    return res.render('user/Register', {
      err_message: 'Invalid Email'
    });
  };
  if(checkPhone.length != 0){
    return res.render('user/Register', {
      err_message: 'Invalid Phone'
    });
  };

  if(req.body.raw_password != req.body.repass){
    return res.render('user/Register', {
      err_message: 'Invalid Password'
    });
  };

  const N = 10;
  const hash = bcrypt.hashSync(req.body.raw_password, N);
  const DateOfBirth = moment(req.body.DateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');

  const entity = req.body;
  entity.password = hash;
  entity.DateOfBirth = DateOfBirth;
  entity.Permission = 0;

  delete entity.raw_password;
  delete entity.repass;
  const result = await userModel.add(entity);
  res.render('user/Register');
});

router.get('/profile/:id', async (req, res) => {
  const rows = await userModel.getWatchList(req.params.id);
  res.render('user/profile', {
    watchlist: rows,
    empty: rows.length === 0,
  });
})

router.get('/profile/:id/changepassword', async (req, res) => {
  res.render('user/changePassword');
})

router.post('/profile/:id/changepassword', async (req, res) => {
  const user = await userModel.single(req.params.id);

  const rs = await bcrypt.compareSync(req.body.current_password, user[0].password);
  if (rs === false){
    return res.render('user/changePassword', {
      err_message: 'Wrong password'
    });
  }


  if(req.body.raw_password != req.body.repass){
    return res.render('user/changePassword', {
      err_message: 'Invalid Password'
    });
  };
  const entity = req.body;
  const N = 10;
  const hash = bcrypt.hashSync(req.body.raw_password, N);
  entity.password = hash;
  entity.id = req.params.id;
  delete entity.raw_password;
  delete entity.current_password;
  delete entity.repass;

  const result = await userModel.updatePassWord(entity);
  return res.render('user/changePassword');
})

router.get('/sellproduct', async (req, res) => {
  res.render('user/sellProduct');
})

router.post('/sellproduct', async (req, res) => {
  const getID = await productModel.getID();
  var files;
  temp = 1;

  ID = getID[0].id + 1;
  upload.array('fuMain', 3)(req, res, err => {
    files = req.files;
    if(files.length != 3)
    {
      return res.render('user/sellProduct', {
        err_message: 'Invalid files'
      });
    }
    else {
      const insert = req.body;
  
      delete insert.buocGia;
      insert.id_sel = res.locals.authUser.id;
      insert.time_start = '2019-12-25 00:00:00';
      insert.time_end = '2020-01-25 00:00:00';
      insert.status_pro = 1;
      insert.qty_img = 3;

      const result = productModel.add(insert);

      res.render('user/sellProduct');
    }
  });
})

router.get('/login', async (req, res) => {
  res.render('user/Login');
});

router.post('/login', async (req, res) => { 
  const user = await userModel.singleByUsername(req.body.username);
  if (user === null){
    return res.render('user/Login', {
      err_message: 'Invalid username or password.'
    });
  }
  const rs = bcrypt.compareSync(req.body.password, user.password);
  if (rs === false){
    return res.render('user/Login', {
    err_message: 'Login failed'
  });
 }

 delete user.password;

 req.session.isAuthenticated = true;
 req.session.authUser = user;

 const url = req.query.retUrl || '/';
 res.redirect(url);
});

router.post('/watchlist', async (req, res) => {
  const entity = req.body;
  const rows = userModel.addWatchList(entity);
  res.redirect(req.headers.referer);
});

router.post('/removewatchlist', async (req, res) => {
  const entity = req.body;
  const rows = userModel.delWatchList(entity);
  res.redirect(req.headers.referer);
});

router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
});


module.exports = router;