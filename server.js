
var express = require('express')
var morgan = require('morgan')
var mongoose = require('mongoose')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session');
var MetaAuth = require('meta-auth');
var utils = require('./app/utils')
var app = express()
var metaAuth = new MetaAuth();

var config = require('./app/config')
mongoose.connect(config.DB, { useNewUrlParser: true })
app.set('view engine', 'ejs');

app.use(session({ secret: 'blockchain', saveUninitialized: false, resave: true }));
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static('css'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var port = config.APP_PORT || 4000
app.listen(port)

console.log('App listening on port ' + port)
var todoRoutes = require('./app/routes')
app.use('/api', todoRoutes)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  next()
})

app.get('/', async function (req, res, next) {
  res.render("authentication");
})


app.get('/auth/:MetaAddress', metaAuth, (req, res) => {
  if (req.metaAuth && req.metaAuth.challenge) {
    res.send(req.metaAuth.challenge)
  }
});

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, async (req, res) => {
  if (req.metaAuth && req.metaAuth.recovered) {
    uId = await utils.createUser(req.metaAuth.recovered, req)
    console.log(uId, req.metaAuth.recovered)
    // res.send(req.metaAuth.recovered);
    if (uId) {
      req.session.userId = uId
      res.send(req.metaAuth.recovered);
    }
    else
      res.status(400).send();
  } else {
    res.status(400).send();
  };
});