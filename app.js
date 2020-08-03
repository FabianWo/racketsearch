const express = require("express");
const routes = require('./routes/routes');
const puppeteer = require("puppeteer");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config({path: 'variables.env'});

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use(function (err, req, res, next) {
  if (err) {
    res.status(500).send('Server Error - 500, message: ' + err);
  }
  next();
});

app.use(function (req, res, next) {
  res.status(404);
  console.log(res.statusCode);
  res.render('index', {status: 404});
});

app.set('port', 7777);
const server = app.listen(7777);