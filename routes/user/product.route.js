const express = require('express');
const productModel = require('../../models/product.model');
const userModel = require('../../models/user.model');
const config = require('../../config/default.json');
const moment = require('moment');
const nodemailer = require('nodemailer');
const DataMasker = require("data-mask");

const router = express.Router();

router.get('/', async (req, res) => {
  const top5product = await productModel.top5product();
  const top5price = await productModel.top5price();
  const top5date = await productModel.top5date();
  for (var i = top5product.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(top5product[i].time_start).add(48, 'hours'), 'hours')) {
      top5product[i].isnew = true;
    }
    else {
      top5product[i].isnew = false;
    }
    if (res.locals.isAuthenticated) {
      const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, top5product[i].id_pro);
      if (checkWatchList.length === 0) {
        top5product[i].watchlist = '1';
      }
    }
  }

  for (var i = top5price.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(top5price[i].time_start).add(48, 'hours'), 'hours')) {
      top5price[i].isnew = true;
    }
    else {
      top5price[i].isnew = false;
    }
    if (res.locals.isAuthenticated) {
      const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, top5price[i].id_pro);
      if (checkWatchList.length == 0) {
        top5price[i].watchlist = '1';
      }
    }
  }

  for (var i = top5date.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(top5date[i].time_start).add(48, 'hours'), 'hours')) {
      top5date[i].isnew = true;
    }
    else {
      top5date[i].isnew = false;
    }
    if (res.locals.isAuthenticated) {
      const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, top5date[i].id_pro);
      if (checkWatchList.length == 0) {
        top5date[i].watchlist = '1';
      }
    }
  }

  res.render('user/vwProducts/allProduct', {
    top5product,
    top5price,
    top5date,
  });
})

router.post('/', async (req, res) => {
  const rows = await productModel.search(req.body.key);
  for (var i = rows.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(rows[i].time_start).add(24, 'hours'), 'hours')) {
      rows[i].isnew = true;
    }
    else {
      rows[i].isnew = false;
    }
  }
  res.render('user/vwProducts/allProduct', {
    products: rows,
    empty: rows.length === 0
  });
})


router.get('/product/:id', async (req, res) => {
  const rows = await productModel.detail(req.params.id);
  const temp = await productModel.relate(rows[0].id_cat);
  const history = await userModel.getHistory(req.params.id);
  rows[0].price_suggest = rows[0].current_price + rows[0].step;
  for (var i = history.length - 1; i >= 0; i--) {
    history[i].username = DataMasker.maskLeft(history[i].username, 5, '*');
  }

  for (var i = temp.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(temp[i].time_start).add(24, 'hours'), 'hours')) {
      temp[i].isnew = true;
    }
    else {
      temp[i].isnew = false;
    }
  }

  if (res.locals.isAuthenticated) {
    const checkWatchList = await userModel.checkWatchList(res.locals.authUser.id, req.params.id);
    if (rows.length === 0) {
      throw new Error('Invalid product id');
    }
    if (checkWatchList.length == 0) {
      res.render('user/vwProducts/productDetail', {
        product: rows[0],
        relate: temp,
        history: history,
        watchlist: '1',
      });
    }
    else {
      res.render('user/vwProducts/productDetail', {
        product: rows[0],
        history: history,
        relate: temp
      });
    }
  }
  else {
    res.render('user/vwProducts/productDetail', {
      product: rows[0],
      history: history,
      relate: temp
    });
  }
})

router.post('/product/:id', async (req, res) => {
  const temp = await productModel.detail(req.params.id);
  const temp1 = await productModel.relate(temp[0].id_cat);
  const avg = await userModel.getAVGRating(res.locals.authUser.username);

  for (var i = temp1.length - 1; i >= 0; i--) {
    const now = moment().startOf('second');
    if (moment(now).isBefore(moment(temp1[i].time_start).add(24, 'hours'), 'hours')) {
      temp1[i].isnew = true;
    }
    else {
      temp1[i].isnew = false;
    }
  }
  if (avg[0].avg < 8) {
    return res.render('user/vwProducts/productDetail', {
      product: temp[0],
      relate: temp1,
      err_message: 'Bạn không đủ điều kiện tham gia đấu giá',
    });
  }
  if (req.body.price < temp[0].current_price || req.body.price > temp[0].buynow_price) {
    return res.render('user/vwProducts/productDetail', {
      product: temp[0],
      relate: temp1,
      err_message: 'Giá đưa ra phải cao hơn giá hiện tại và thấp hơn giá mua ngay'
    });
  }
  if ((req.body.price - temp[0].current_price) % temp[0].step != 0) {
    return res.render('user/vwProducts/productDetail', {
      product: temp[0],
      relate: temp1,
      err_message: 'Giá không hợp lệ',
    });
  }
  else {
    const entity = req.body;
    entity.id_pro = req.params.id;
    entity.price = req.body.price;
    entity.id = req.session.authUser.id;

    const rows = await productModel.bidding(entity);
    const temp2 = await productModel.update_price(entity);

    // Send email =================================================
    var transporter = nodemailer.createTransport({ // config mail server
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ngmanh2104@gmail.com', //Tài khoản gmail vừa tạo
        pass: 'ngocmanh99' //Mật khẩu tài khoản gmail vừa tạo
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
    var content = '';
    content += `
      <div style="padding: 10px; background-color: #003375">
          <div style="padding: 10px; background-color: white;">
              <h4 style="color: #0085ff">Gửi mail từ hệ thống đấu giá online</h4>
              <span style="color: black">Đây là mail test</span>
          </div>
      </div>
    `;
    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'ngmanh2104@gmail.com',
      to: req.session.authUser.email,
      subject: 'Website auctions online',
      text: 'Chúc mừng bạn đã bidding thành công!',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
      //html: content //Nội dung html mình đã tạo trên kia :))
    }
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
        //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
        //res.redirect('/');
      } else {
        console.log('Message sent: ' + info.response);
        //req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
        //res.redirect('/');
      }
    });

    // /Send email ================================================
    res.render('user/vwProducts/productDetail', {
      product: temp[0],
      relate: temp1,
    });
  }
})

router.post('/product/:id/buynow', async (req, res) => {
  const rows = await productModel.buynow(req.body);
  // Send email =================================================
  var transporter = nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'ngmanh2104@gmail.com', //Tài khoản gmail vừa tạo
      pass: 'ngocmanh99' //Mật khẩu tài khoản gmail vừa tạo
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
  const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
    from: 'ngmanh2104@gmail.com',
    to: req.session.authUser.email,
    subject: 'Website auctions online',
    text: 'Chúc mừng bạn mua thành công sản phẩm',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
  }
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      //req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
      //res.redirect('/');
    } else {
      console.log('Message sent: ' + info.response);
      //req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
      //res.redirect('/');
    }
  });

  // /Send email ================================================
  res.redirect(req.headers.referer);
})

// edit product
router.get('/product/:id/edit', async (req, res) => {
  const rows = await productModel.single(req.params.id);
  //console.log(rows[0].name_pro);
  res.render('user/vwProducts/editProduct', {
  product: rows[0],
  empty: rows.length === 0,
  });
})

router.post('/update_des', async (req, res) => {
  if(req.body.description_new){
    const rows = await productModel.single(req.params.id);
    return res.render('user/vwProducts/editProduct', {
      err_message: 'Giá mua ngay cao hơn giá hiện tại',
      product: rows[0],
      empty: rows.length === 0,
    });
  }
  const rows = await productModel.update_des(req.body);
  res.render('user/vwProducts/editProduct', {
    
  });
})

module.exports = router;