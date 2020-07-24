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
  useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.error(err.message));
mongoose.connection.once('open', () => {
  console.log('Mongo connection successful!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.set('port', 7777);
const server = app.listen(7777);