const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const morgan = require('morgan');
const numeral = require('numeral');
const dateFormat = require('dateformat');
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const hbs = exphbs.create({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/_layouts',

  helpers: {
    section: hbs_sections(),
    format: val => numeral(val).format('0,0') + ' đ',
    dateformat: val => dateFormat(val, "dd/mm/yyyy"),
    ifCond: function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});

app.engine('hbs', hbs.engine);
// app.engine('hbs', exphbs({
//   defaultLayout: 'main.hbs',
//   layoutsDir: 'views/_layouts'
// }));
app.set('view engine', 'hbs');

app.get('/about', (req, res) => {
  res.render('about');
})

app.use('/admin/categories', require('./routes/admin/category.route'));

app.use('/admin/products', require('./routes/admin/product.route'));

app.use('/', require('./routes/user/product.route'));

app.use('/user', require('./routes/user/Account.route'));

// app.use('/admin/bidders', require('./routes/admin/bidder.route'));

app.use(express.static(__dirname+'/public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})