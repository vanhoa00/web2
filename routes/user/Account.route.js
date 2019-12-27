const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const multer  = require('multer')
const userModel = require('../../models/user.model');

const router = express.Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname)
    console.log(file);
  },
  destination: function (req, file, cb) {
    cb(null, `./public/images/product`);
  },
});
const upload = multer({ storage });


router.get('/register', async (req, res) => {
  res.render('user/Register');
})

router.post('/register', async (req, res) => {
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

router.get('/profile', async (req, res) => {
  res.render('user/profile');
})



router.get('/sellproduct', async (req, res) => {
  res.render('user/sellProduct');
})

router.post('/sellproduct', async (req, res) => {
  upload.single('fuMain')(req, res, err => {
    if (err) { }
      res.render('user/sellProduct');
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

 console.log(req.query.retUrl)

 const url = req.query.retUrl || '/';
 res.redirect(url);
});

router.post('/logout', (req, res) => {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
});



module.exports = router;