// const mongoose = require('mongoose');

exports.displayRackets = async (searchqueries) => {
  const data = [];
  let brandsToSearch;

  // make searchquery array
  searchqueries = searchqueries.split(" ")
    .map((el) => el.toLowerCase());

  // filter brands against queries
  if (searchqueries[0] === 'all') {
    brandsToSearch = ['wilson', 'babolat', 'yonex', 'head', 'dunlop', 'prokennex', 'gamma', 'tecnifibre', 'prince'];
  } else {
    brandsToSearch = ['wilson', 'babolat', 'yonex', 'head', 'dunlop', 'prokennex', 'gamma', 'tecnifibre', 'prince']
    .filter((brand) => {
      return searchqueries.includes(brand);
    });
  }
  
  // iterate through brands and read DB data of each racket
  for await(const brand of brandsToSearch) {
    module.exports.brandName = brand;
    console.log('reading ' + module.exports.brandName);
    const RacketModel = require('./DbSchema')('./DisplayData');

    const readRackets = await RacketModel.find({},'', {lean: true}, (err, doc) => {
      if (err) console.error(err);
    });

    data.push(readRackets);
  }

  return data;
};

exports.displaySingleRacket = async (racketName) => {
  let brandToSearch;
  brandToSearch = ['wilson', 'babolat', 'yonex', 'head', 'dunlop', 'prokennex', 'gamma', 'tecnifibre', 'prince']
  .find((brand) => racketName.toLowerCase().includes(brand));

  module.exports.brandName = brandToSearch;
  console.log('reading ' + racketName + ' in ' + module.exports.brandName);
  const RacketModel = require('./DbSchema')('./DisplayData');
  const readSingleRacket = await RacketModel.findOne({racketName}, '', {lean: true}, (err, doc) => {
    if (err) console.log(err);
  });
  return [readSingleRacket];
};