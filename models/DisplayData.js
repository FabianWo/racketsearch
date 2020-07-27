const mongoose = require('mongoose');

const displayData = async (searchqueries) => {
  const data = [];
  let brandsToSearch;

  // make searchquery array, exclude scrape statement
  searchqueries = searchqueries.split(" ")
    .filter((query) => query !== '**scrape**')
    .map((el) => el.toLowerCase());

  // filter brands against queries 
  brandsToSearch = ['wilson', 'babolat', 'yonex', 'head', 'dunlop', 'prokennex', 'gamma', 'tecnifibre', 'prince']
    .filter((brand) => {
      return searchqueries.includes(brand);
    });
  
  // iterate through brands and read DB data of each racket
  for await(const brand of brandsToSearch) {
    module.exports.brandName = brand;
    console.log('reading ' + module.exports.brandName);
  
    const RacketModel = require('./DbSchema')('./DisplayData');

    const readRackets = await RacketModel.find({},'', {lean: true}, (err, doc) => {
      if (err) { console.error(err); }
    });

    data.push(readRackets);    
  }
  
  return data;

};

module.exports = displayData;