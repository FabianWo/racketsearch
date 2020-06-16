const scraper = require('puppeteer');
const DataFetcher = require('./DataFetcher');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const scrape = async (searchqueries) => {
  // --------------------------------------------------------
  // -- Scraper/Puppeteer Setup --
  searchqueries = searchqueries.split(" ");
  console.log(searchqueries);

  const browser = await scraper.launch({headless: false});
  const page = await browser.newPage();
  const url = "https://www.tennis-warehouse.com";
  // console.log('going to ' + url);
  await page.goto(url);

  // --------------------------------------------------------
  // -- SETUP --

  // pull out brand names/links to sites
  const [brandListOneHandle] = await page.$x('//*[@id="lnav"]/div[4]/div[1]/ul');
  const brandListOne = await brandListOneHandle.$$eval('a', (el) => el.map((el) => el.getAttribute('href')));
  const [brandListTwoHandle] = await page.$x('//*[@id="lnav"]/div[4]/div[2]/ul');
  const brandListTwo = await brandListTwoHandle.$$eval('a', (el) => el.map((el) => el.getAttribute('href')));

  // filter brands with searchqueries
  const brandLinksFiltered = [...brandListOne, ...brandListTwo]
  .filter((brand) => {
    return searchqueries.some((query) => brand.toLowerCase().includes(query));
  });
  console.log(brandLinksFiltered);

  // --------------------------------------------------------
  // -- Brand Iteration --

  //  ++ To_do ++

  //  [
  //   BabolatData[
  //     {
  //       racketName: ..,
  //       racketPicturelink: ...,
  //       racketspecs: ...,
  //     }, ...
  //   ], ...[]
  // ]

  console.log('going to ' + `${url}${brandLinksFiltered[0]}`);
  await page.goto(`${url}${brandLinksFiltered[0]}`);

  // delete unnecessary items
  const [un] = await page.$x('//*[@id="content_wrap"]/div[12]/div/div');
  await un.evaluateHandle((el) => el.remove(0));

  // all racketsitelinks and racketnames
  const allRacketLinks = await page.$$eval('a.name', (el) => el.map((el) => el.getAttribute('href'))
    .filter((el) => !el.includes('Junior'))
    .filter((el) => !el.includes('2-Pack'))
  );

  // Get racket data and store it
  const racketsData = await DataFetcher.scrapeData(browser, page, allRacketLinks, brandLinksFiltered);
  
  // --------------------------------------------------------


  // console.log(racketsData);
  return racketsData;


  // setTimeout(async () => {
    
  //   await browser.close();
  // }, 5000);
};

module.exports = scrape;