const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const startScraper = require('../models/ScraperSetup');
const displayData = require('../models/DisplayData');
const auth = require('../models/Users');
// const passport = require('passport');
// const AuthStrategy = require('../models/Auth').LocalAuthStrategy;
// const execAuth = require('../models/Auth').ExecuteAuth;

exports.home = (req, res) => {
  res.render('index');
  console.log("CONNECTED");
};

exports.redirect = (req, res) => {
  let searchqueries = req.body.searchqueries;
  if (searchqueries === '') {
    res.render('index', {data: false});
  } else if (searchqueries.includes('**scrape**')) {
    res.redirect(`/scrape/${searchqueries}`);
  } else if (searchqueries) {
    res.redirect(`/search/${searchqueries}`);
  }
  // searchqueries filtern, keine sonderzeichen erlauben
};

exports.displayScrapeData = async (req, res) => {
  let searchqueries = req.params.searchqueries.split(' ')
    .filter(el => el !== '**scrape**').join(' ');
  console.log('running displayScrapeData');
  
  const data = await displayData(searchqueries);
  if (data.length === 0) {
    res.render('index', {data: false});
  } else {
    res.render('index', {data});
  }
};

exports.getScrapeData = async (req, res) => {
  let searchqueries = req.params.searchqueries.split(' ')
    .filter(el => el !== '**scrape**');

  console.log("Scraping data for " + searchqueries);
  const data = await startScraper(searchqueries);
  res.redirect(`/search/${searchqueries}`);
};

exports.register = async (req, res) => {
  if (req.method === 'GET') {
    res.render('index', {register: true});
  } else if (req.method === 'POST') {
    console.log(req.body.username, req.body.password, req.body.passwordConfirm);
    const isRegistered = await auth.registerUser(req.body.username, req.body.password, req.body.passwordConfirm);
    // console.log(isRegistered);

    if (isRegistered) {
      req.flash('info', 'Hellooooooo');
      req.flash('error', 'erroooooor');
      console.log('register successful');
      res.render('index', {});
    } else {
      res.render('index', {login: true});
    }

  }
};

exports.login = async (req, res) => {
  if (req.method === 'GET') {
    res.render('index', {login: true});
  } else if (req.method === 'POST') {
    console.log(req.body.username, req.body.password);

    // res.render('index', {login: true});
  }
};