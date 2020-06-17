const express = require("express");
const routes = require('./routes/routes')
const puppeteer = require("puppeteer");
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "pug")

app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config({path: 'variables.env'});

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', err => console.error(err.message));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', routes);

app.set('port', 7777);
const server = app.listen(7777);

console.log();


/*
 1. get @username
 2. compose urls with username
 3. store image urls
 4. get images in biggest size
 5. display
 6. option to DL as zip
*/
// const submitButton = document.querySelector("button");
// const usernameInput = document.querySelector("input");

// let username = "";
// let url ="";

// submitButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log(usernameInput.value);
//   username = `@${usernameInput.value}`;
//   console.log(username);
//   url = `https://www.instagram.com/${username}/`;
//   const site = fetch(url);
//   console.log(site);

//   // next: install puppeteer.js and continue
// })
