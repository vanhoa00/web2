const express = require('express');
const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const morgan = require('morgan');
const numeral = require('numeral');
const dateFormat = require('dateformat');
const session = require('express-session');

//
// const bodyParser = require('body-parser');
// const request = require('request');
//
require('express-async-errors');
const app = express();

//
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/_layouts',
  partialsDir: __dirname + '/views/partials',

  helpers: {
    section: hbs_sections(),
    format: val => numeral(val).format('0,0') + ' đ',
    dateformat: val => dateFormat(val, "dd/mm/yyyy"),
    datetimeformat: val => dateFormat(val, "dd/mm/yyyy HH:MM:ss"),
    ifCond: function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  }
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //     secure: true
  // }
}))

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

app.get('/about', (req, res) => {
  res.render('about');
});

require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.use(express.static(__dirname+'/public'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})