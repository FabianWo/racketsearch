const express = require('express');
const scrapeData = require('../models/Scraper')

exports.home = (req, res) => {
  // res.sendFile('public/css/styles.css');
  res.render('index');
  console.log("CONNECTED");
}

exports.redirect = (req, res) => {
  const searchqueries = req.body.searchqueries;
  // searchqueries filtern, keine sonderzeichen erlauben
  res.redirect(`/scrape/${searchqueries}`);
}

exports.displayScrapeData = async (req, res) => {
  console.log("Scraping data for " + req.params.searchqueries);
  const data = await scrapeData(req.params.searchqueries);
  // console.log(data);
  res.render('index', {data});
}