
var express = require('express')
var morgan = require('morgan')
var path = require('path')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var session = require('express-session');
let ETH_TESTNET = 'https://ropsten.infura.io/v3/6d83b486e19548de928707c8336bf15b'
const MetaAuth = require('meta-auth');
const metaAuth = new MetaAuth();


var task = ["buy socks", "practise with nodejs"];
var complete = ["finish jquery"];

var config = require('./app/config')
mongoose.connect(config.DB)
app.set('view engine', 'ejs');

app.use(session({secret: 'blockchain',saveUninitialized: true,resave: true}));
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static('css'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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

app.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
  if (req.metaAuth && req.metaAuth.recovered) {
    res.send(req.metaAuth.recovered);
  } else {
    res.status(400).send();
  };
});