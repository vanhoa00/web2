const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer  = require('multer')
const dateFormat = require('dateformat');
const validator = require("email-validator");
var modifyFilename = require('modify-filename');
const userModel = require('../../models/user.model');
const productModel = require('../../models/product.model');
const ratingModel = require('../../models/rating.model');
const categoryModel = require('../../models/category.model');
const DataMasker = require("data-mask");

const restrict = require('../../middlewares/auth.mdw');

// dùng để sử dụng captcha
//const bodyParser = require('body-parser');
//const request = require('request');
//


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
  const checkEmail = await userModel.checkEmail(req.body.Email);
  
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
  if(validator.validate(req.body.Email) === false || checkEmail.length != 0){
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

  // // check captcha
  // if (!req.body.captcha)
  //   return res.json({ success: false, msg: 'Please select captcha' });
  
  // const secretKey = "6LfaQMwUAAAAAD7nO6IQEq2xSoTmCGlGIc2Fx5gP";

  // // Verify URL
  // const query = stringify({
  //   secret: secretKey,
  //   response: req.body.captcha,
  //   remoteip: req.connection.remoteAddress
  // });
  // const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // // Make a request to verifyURL
  // const body = await fetch(verifyURL).then(res => res.json());

  // // If not successful
  // if (body.success !== undefined && !body.success)
  //   return res.json({ success: false, msg: 'Failed captcha verification' });

  // // If successful
  // return res.json({ success: true, msg: 'Captcha passed' });
  // // /check captcha

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

router.get('/profile/:id', restrict, async (req, res) => {
  const user = await userModel.single(req.params.id);
  const avg = await userModel.getAVGRating(user[0].username);
  const rating = await userModel.getRating(user[0].username);
  const watchlist = await userModel.getWatchList(req.params.id);
  const myProduct = await productModel.getMyProduct(req.params.id);
  const myAuction = await productModel.getMyAuction(req.params.id);
  const myWonlist = await productModel.getMyWonlist(req.params.id);
  for (var i = myAuction.length - 1; i >= 0; i--) {
    if(myAuction[i].id_winner == req.params.id){
      myAuction[i].isWon = true;
    }
  }
  for (var i = rating.length - 1; i >= 0; i--) {
    rating[i].person_rating = DataMasker.maskLeft(rating[i].person_rating, 5, '*');
  }
  res.render('user/profile', {
    user: user[0],
    avg: avg[0].avg,
    watchlist: watchlist,
    myProduct: myProduct,
    myAuction: myAuction,
    myWonlist: myWonlist,
    rating: rating,
    watchlist_empty: watchlist.length === 0,
    myProduct_empty: myProduct.length === 0,
    myAuction_empty: myAuction.length === 0,
    myWonlist_empty: myWonlist.length === 0,
  });
})

router.get('/profile/:id/changeprofile', async (req, res) => {
  const user = await userModel.single(req.params.id);
  res.render('user/changeProfile', {
    user: user[0],
    empty: user.length === 0,
  });
})

router.post('/profile/:id/changeprofile', async (req, res) => {
  const entity = req.body;
  if(entity.name == "" || entity.Email == "" || entity.Phone == ""){
    const user = await userModel.single(req.params.id);
    return res.render('user/changeProfile', {
      user: user[0],
      empty: user.length === 0,
    });
  }
  const username = req.body.username;
  delete entity.username;
  entity.DateOfBirth = moment(req.body.DateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
  
  const result = await userModel.updateProfile(entity, username);
  const user = await userModel.single(req.params.id);
  res.render('user/changeProfile', {
    user: user[0],
    empty: user.length === 0,
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

// rating
router.get('/profile/:id/rating', restrict, async (req, res) => {
  const user = await userModel.single(req.params.id);
  const rating = await userModel.getRating(user[0].username);
  const avg = await userModel.getAVGRating(user[0].username);

  for (var i = rating.length - 1; i >= 0; i--) {
    rating[i].person_rating = DataMasker.maskLeft(rating[i].person_rating, 5, '*');
  }

  res.render('user/rating', {
    user: user[0],
    avg: avg[0].avg,
    empty: user.length === 0,
    rating: rating,
  });
})
router.post('/profile/:id/rating', async (req, res) => {
  const entity = req.body;
  delete entity.name;
  const result = await ratingModel.add(entity);
  // res.render('user/profile');
  res.redirect(req.headers.referer);

})

router.post('/profile/:id/upgrade_suggest', async (req, res) => {
  const result = await userModel.upgrade_suggest(req.body.id);
  res.redirect(req.headers.referer);
})

router.get('/sellproduct', restrict, async (req, res) => {
  const rows = await categoryModel.cat_lv2();
  console.log(rows);
  res.render('user/sellProduct', {
    cat_lv2 : rows,
  });
})

router.post('/sellproduct', async (req, res) => {
  console.log(req.body);


  const getID = await productModel.getID();
  var files;
  temp = 1;

  ID = getID[0].id + 1;
  upload.array('fuMain', 3)(req, res, err => {
    if(req.body.name_pro == "" || req.body.current_price == "" || req.body.step == "" || req.body.buynow_price == "" || req.body.description == ""){
      return res.render('user/sellProduct', {
        err_message: 'Invalid data'
      });
    }
  
    if(req.body.current_price > req.body.buynow_price){
      return res.render('user/sellProduct', {
        err_message: 'Giá mua ngay cao hơn giá hiện tại'
      });
    }
    files = req.files;
    if(files.length != 3)
    {
      return res.render('user/sellProduct', {
        err_message: 'Invalid files'
      });
    }
    else {
      const insert = req.body;
  
      insert.id_sel = res.locals.authUser.id;

      const now = moment().startOf('second');
      insert.time_start = dateFormat(now, "yyyy-mm/dd HH:MM:ss");
      insert.time_end = dateFormat(now.add(15, 'day'), "yyyy-mm/dd HH:MM:ss");
      insert.status_pro = 1;
      insert.qty_img = 3;
      insert.id_winner = req.body.id_sel;

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