const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

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
app.use(express.static(__dirname+'/public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})