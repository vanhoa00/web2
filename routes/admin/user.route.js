const express = require('express');
const userModel = require('../../models/user.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await userModel.all();
  res.render('vwUsers/index', {
    users: rows,
    empty: rows.length === 0
  });
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/upgradelist', async (req, res) => {
  const rows = await userModel.upgrade_list();
  res.render('vwUsers/upgradelist', {
    users: rows,
    empty: rows.length === 0
  });
})

router.get('/detail/:id', async (req, res) => {
  const rows = await userModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid bidder id');
  }
  res.render('vwUsers/detail', {
    user: rows[0]
  });
})

router.get('/edit/:id', async (req, res) => {
  const rows = await userModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid bidder id');
  }
  res.render('vwUsers/edit', {
    user: rows[0]
  });
})

router.post('/patch', async (req, res) => {
  const result = await bidderModel.patch(req.body);
  res.redirect('/admin/bidders');
})

router.post('/del', async (req, res) => {
  const result = await bidderModel.del(req.body.CatID);
  // console.log(result.affectedRows);
  res.redirect('/admin/bidders');
})

module.exports = router;