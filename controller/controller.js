const express = require('express');
const startScraper = require('../models/ScraperSetup');
const displayData = require('../models/DisplayData')
const mongoose = require('mongoose');

exports.home = (req, res) => {
  res.render('index');
  console.log("CONNECTED");
};

exports.redirect = (req, res) => {
  const searchqueries = req.body.searchqueries;
  if (searchqueries.includes('**scrape**')) {
    res.redirect(`/search/scrape/${searchqueries}`);
  }
  // searchqueries filtern, keine sonderzeichen erlauben
  if (searchqueries) {
    res.redirect(`/search/${searchqueries}`);
  } else {
    res.redirect(`/`);
  }
};

exports.displayScrapeData = async (req, res) => {  
  console.log('running displayData');
  const data = await displayData(req.params.searchqueries);
  // console.log(JSON.stringify(data, null, '  '));
  
  res.render('index', {data});
};

exports.getScrapeData = async (req, res) => {
  console.log("Scraping data for " + req.params.searchqueries);
  const data = await startScraper(req.params.searchqueries);
  // console.log(data);
  // const saveData = await (new RacketSchema(req.body)).save();
  // console.log('data saved');
};