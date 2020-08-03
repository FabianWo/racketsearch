const express = require('express');
const startScraper = require('../models/ScraperSetup');
const displayData = require('../models/DisplayData');
const mongoose = require('mongoose');

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