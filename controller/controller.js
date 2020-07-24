const express = require('express');
const startScraper = require('../models/ScraperSetup');
const mongoose = require('mongoose');

exports.home = (req, res) => {
  res.render('index');
  console.log("CONNECTED");
};

exports.redirect = (req, res) => {
  const searchqueries = req.body.searchqueries;
  // searchqueries filtern, keine sonderzeichen erlauben
  searchqueries ? res.redirect(`/search/${searchqueries}`) : res.redirect(`/`);
};

exports.displayScrapeData = async (req, res) => {
  console.log("Scraping data for " + req.params.searchqueries);
  const data = await startScraper(req.params.searchqueries);
  // console.log(data);
  // const saveData = await (new RacketSchema(req.body)).save();
  // console.log('data saved');
  res.render('index', {data});
};

// scraper und display trennen