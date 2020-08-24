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
    res.render('noSearchResults', {data: false});
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
    res.render('noSearchResults', {data: false});
  } else {
    res.render('showRackets', {data});
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
    res.render('register', {});
  } else if (req.method === 'POST') {
    // console.log(req.body.username, req.body.password, req.body.passwordConfirm);
    const isRegistered = await auth.registerUser(req.body.username, req.body.password, req.body.passwordConfirm);
    // console.log(isRegistered);

    if (isRegistered) {
      console.log('register successful');
      req.flash('authSuccess', 'Registrierung erfolgreich !');
      res.redirect('/login');
    } else {
      req.flash('authError', 'Registrierung fehlgeschlagen, überprüfe deine Daten !');
      res.redirect('/register');
    }
  }
};

exports.login = async (req, res) => {
  if (req.method === 'GET') {
    res.render('login', {});
  } else if (req.method === 'POST') {
    console.log(req.body.username, req.body.password);

    res.render('login', {});
  }
};