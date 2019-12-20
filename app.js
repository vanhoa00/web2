const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: 'views/_layouts'
}));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  // res.end('hello from expressjs');
  res.render('home');
})

app.get('/about', (req, res) => {
  res.render('about');
})

app.use('/admin/categories', require('./routes/admin/category.route'));

app.use('/admin/products', require('./routes/admin/product.route'));

// app.use('/admin/bidders', require('./routes/admin/bidder.route'));

app.use(express.static(__dirname+'/public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})