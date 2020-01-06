const express = require('express');
const bidderModel = require('../../models/bidder.model');

const router = express.Router();


router.get('/', async (req, res) => {
  const rows = await bidderModel.all();
  res.render('vwBidders/index', {
    bidders: rows,
    empty: rows.length === 0
  });
})

router.get('/add', (req, res) => {
  res.render('vwBidders/add');
})

router.post('/add', async (req, res) => {
  const result = await bidderModel.add(req.body);
  res.render('vwBidders/add');
})

router.get('/err', (req, res) => {

  throw new Error('error occured');
})

router.get('/edit/:id', async (req, res) => {
  const rows = await bidderModel.single(req.params.id);
  if (rows.length === 0) {
    throw new Error('Invalid bidder id');
  }
  res.render('vwBidders/edit', {
    bidder: rows[0]
  });
})

router.post('/patch', async (req, res) => {
  const result = await bidderModel.patch(req.body);
  res.redirect('/admin/bidders');
})

router.post('/del', async (req, res) => {
  const result = await bidderModel.del(req.body.CatID);
  res.redirect('/admin/bidders');
})

module.exports = router;