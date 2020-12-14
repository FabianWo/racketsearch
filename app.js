const express = require("express");
const routes = require('./routes/routes');
const puppeteer = require("puppeteer");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');


// start app
const app = express();

// set view engine/folder
app.set("views", (__dirname + '/views'));
app.set("view engine", "pug");

// set public files folder/private variables
app.use(express.static(__dirname + '/public'));
require('dotenv').config({path: path.join(__dirname, 'variables.env')});

// connect mongodb with mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
mongoose.connection.on('error', err => console.error(err.message));
mongoose.connection.once('open', () => {
  console.log('Mongo connection successful!');
});

// disable login cache for full logouts
app.use(function(req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// setup bodyparser, cookieparser, express.session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'seecrettstring'
}));

// setup passport strategy and helpers
const initializePassport = require('./models/localAuth').initializePassport;
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// setup flash-messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
});

// handle routes
app.use('/projects/racketsearch/', routes);

// app.post('/login', (req, res, next) => {
//   passport.authenticate('local',{
//     successRedirect: '/',
//     failureRedirect: '/fail'
//   }, (req, res) => {
//     res.redirect('/');
//   });
// });

// handle 500 errors
app.use('/projects/racketsearch/', function (err, req, res, next) {
  if (err) {
    res.status(500);
    console.log(res.statusCode);
    console.log('\nerrorlog: \n\n' + err + '\n\n');
    res.render('index', {status: 500});
  } else {
    next();
  }
});

// handle 404 errors
app.use('/projects/racketsearch/', function (req, res, next) {
  res.status(404);
  console.log(res.statusCode);
  res.render('error', {status: 404});
});

app.set('port', 7777);
const server = app.listen(7777);