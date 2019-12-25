const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');

const router = express.Router();

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
  //delete entity.dob;
  delete entity.repass;

  const result = await userModel.add(entity);
  res.render('user/Register');
});

router.get('/login', async (req, res) => {
  res.render('user/Login');
})

router.post('/login', async (req, res) => { 
  const user = await userModel.singleByUsername(req.body.username);
   if (user === null){
      return res.render('user/Login', {
      err_message: 'Invalid username or password.'
      });
   }
   console.log(user);
  const rs = bcrypt.compareSync(req.body.password, user.password);
  if (rs === false){
     return res.render('user/Login', {
      err_message: 'Login failed'
    });
  }

  delete user.password;
  const url = req.query.retUrl || '/';
  res.redirect(url);
});


module.exports = router;