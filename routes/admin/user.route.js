const express = require('express');
const userModel = require('../../models/user.model');
const moment = require('moment');
const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await userModel.all();
  res.render('backend/vwUsers/index', {
    users: rows,
    empty: rows.length === 0
  });
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/upgradelist', async (req, res) => {
  const rows = await userModel.upgrade_list();
  res.render('backend/vwUsers/upgradelist', {
    users: rows,
    empty: rows.length === 0
  });
})

router.get('/detail/:id', async (req, res) => {
  const rows = await userModel.single(req.params.id);
  console.log(rows);
  if (rows.length === 0) {
    throw new Error('Invalid user id');
  }
  res.render('backend/vwUsers/detail', {
    user: rows[0]
  });
})

router.get('/edit/:id', async (req, res) => {
  const rows = await userModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid user id');
  }
  res.render('backend/vwUsers/edit', {
    user: rows[0]
  });
})

router.post('/patch', async (req, res) => {
  req.body.DateOfBirth = moment(req.body.DateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
  if(req.body.Permission === 'Bidder') req.body.Permission = 0;
  else req.body.Permission = 1;
  const result = await userModel.patch(req.body);
  res.redirect('/admin/users');
})

router.post('/upgrade', async (req, res) => {
  const result = await userModel.upgrade(req.body.id);
  res.redirect('/admin/users');
})

router.post('/downgrade', async (req, res) => {
  console.log(req.body);
  const result = await userModel.downgrade(req.body.id);
  
  res.redirect('/admin/users');
})

router.post('/del', async (req, res) => {
  const result = await userModel.del(req.body.id);
  //console.log(req.body.id);
  res.redirect('/admin/users');
})

module.exports = router;