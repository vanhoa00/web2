const express = require('express');
// const bcrypt = require('bcryptjs');
const moment = require('moment');
const userModel = require('../../models/user.model');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('user/Register');
})

router.post('/', async (req, res) => {
  const N = 10;
  console.log(req.body);
  //const hash = bcrypt.hashSync(req.body.pass, N);
  const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

  const entity = req.body;
  entity.username = req.body.username;
  entity.name = req.body.name;
  entity.email = req.body.Email;
  entity.Phone = req.body.Phone;
  entity.DateOfBirth = dob;
  entity.password = req.body.pass;
  entity.Permission = 0;

  // delete entity.password;
  // delete entity.dob;

  const result = await userModel.add(entity);
  res.render('user/Register');
});


module.exports = router;