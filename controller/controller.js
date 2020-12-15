// const express = require('express');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const passport = require('passport');
const startScraper = require('../models/ScraperSetup');
const displayData = require('../models/DisplayData');
const handleUsers = require('../models/HandleUsers');
const dynamicUrl = require('../helpers/dynamicRoutes').dynamicURL;

exports.home = (req, res) => {
  console.log(dynamicUrl);
  res.render('index', { dynamicUrl: dynamicUrl });
  console.log("CONNECTED");
};

exports.redirect = (req, res) => {
  let searchqueries = req.body.searchqueries;
  if (searchqueries === '') {
    res.render('noSearchResults', {data: false, dynamicUrl: dynamicUrl});
  } else if (searchqueries.includes('**scrape**')) {
    res.redirect(`${dynamicUrl}scrape/${searchqueries}`);
  } else if (searchqueries) {
    res.redirect(`${dynamicUrl}search/${searchqueries}`);
  }
  // searchqueries filtern, keine sonderzeichen erlauben
};

exports.displayScrapeData = async (req, res) => {
  let searchqueries = req.params.searchqueries.split(' ')
    .filter(el => el !== '**scrape**').join(' ');
  console.log('running displayScrapeData');
  
  const data = await displayData(searchqueries);
  if (data.length === 0) {
    res.render('noSearchResults', {data: false, dynamicUrl: dynamicUrl});
  } else {
    res.render('showRackets', {data, dynamicUrl: dynamicUrl});
  }
};

exports.getScrapeData = async (req, res) => {
  let searchqueries = req.params.searchqueries.split(' ')
    .filter(el => el !== '**scrape**');

  console.log("Scraping data for " + searchqueries);
  const data = await startScraper(searchqueries);
  res.redirect(`${dynamicUrl}search/${searchqueries}`);
};

exports.register = async (req, res) => {
  if (req.method === 'GET') {
    res.render('register', {
      registerErrors: false,
      formData: false,
      dynamicUrl: dynamicUrl
    });

  } else if (req.method === 'POST') {
    const isRegistered = await handleUsers.registerUser(req, req.body.username, req.body.password, req.body.passwordConfirm);
    const formData = {...req.body};
    console.log(formData);

    if (isRegistered.status) {
      req.flash('authSuccess', 'Registrierung erfolgreich !');
      res.redirect(`${dynamicUrl}login`);

    } else if (isRegistered.registerErrors) {
      console.log(isRegistered);
      res.render('register', {
        registerErrors: isRegistered.registerErrors,
        formData: formData,
        dynamicUrl: dynamicUrl
      });
      // isRegistered.error();
      // res.redirect('/register');

    }
  }
};

exports.login = async (req, res, next) => {
  if (req.method === 'GET') {
    res.render('login', {dynamicUrl: dynamicUrl});

  } else if (req.method === 'POST') {
    console.log(JSON.stringify(req.body, 2));
    handleUsers.loginUser(req, res, next);
    // passport.authenticate('local', (err, user, info) => {
    //   if (err) console.error(err);
    //   if (user) {
    //     req.flash('authSuccess', 'Login erfolgreich !');
    //     res.redirect('/login');
    //   } else {
    //     req.flash('authError', `${info.message}`);
    //     res.redirect('/login');
    //   }
    //   console.log(user);
    //   console.log(info);
    // })(req, res, next);
    
  }
};

exports.logout = (req, res) => {
  if (req.user) {
    console.log('logout');
    req.logout();
    req.flash('authSuccess', 'Logout Erfolgreich !');
  }
  res.redirect(`${dynamicUrl}login`);
};

exports.dashboard = (req, res) => {
  res.render('dashboard', {
    user: req.user,
    dynamicUrl: dynamicUrl
  });
};