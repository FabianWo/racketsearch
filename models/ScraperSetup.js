const scraper = require('puppeteer');
const DataFetcher = require('./DataFetcher');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const scrape = async (searchqueries) => {

  // ---------------- Scraper/Puppeteer Setup ------------------
  // searchqueries = searchqueries.split(" ");
  // .filter((query) => query !== '**scrape**');
  brandsToSearch = ['wilson', 'babolat', 'yonex', 'head', 'dunlop', 'prokennex', 'gamma', 'tecnifibre', 'prince']
    .filter((brand) => {
      return searchqueries.includes(brand);
    });

  const browser = await scraper.launch({headless: true});
  const page = await browser.newPage();
  const url = "https://www.tennis-warehouse.com";
  await page.goto(url);

  // pull out brand names/links to sites
  const [brandListOneHandle] = await page.$x('//*[@id="lnav"]/div[6]/div[1]/ul');
  const brandListOne = await brandListOneHandle.$$eval('a', (el) => el.map((el) => el.getAttribute('href')));
  const [brandListTwoHandle] = await page.$x('//*[@id="lnav"]/div[6]/div[2]/ul');
  const brandListTwo = await brandListTwoHandle.$$eval('a', (el) => el.map((el) => el.getAttribute('href')));

  // filter brands with searchqueries
  const brandLinksFiltered = [...brandListOne, ...brandListTwo]
  .filter((brand) => {
    return brandsToSearch.some((query) => brand.toLowerCase().includes(query));
  });


  // ---------------------Scrape Loop---------------------------
  for await(const brandLink of brandLinksFiltered) {
    console.log('going to ' + `${url}${brandLink}`);
    await page.goto(`${url}${brandLink}`);

    // delete unnecessary items
    await page.$eval('.cat_list.subcatlist.carousel_list.cf', el => el.remove());

    // all racketsitelinks and racketnames
    const allRacketLinks = await page.$$eval('a.name', (el) => el.map((el) => el.getAttribute('href'))
      .filter((el) => !el.includes('Junior'))
      .filter((el) => !el.includes('2-Pack'))
    );

    // export brandname for dynamic Schema/DB saving
    const brandName = brandLink.replace('racquets.html', '').slice(1);
    module.exports.brandName = brandName;
    
    // Scrape racketbrand
    const racketData = await DataFetcher.scrapeData(browser, page, allRacketLinks, brandName);

    // console.log(racketData);

    // reset brandname for schema 
    module.exports.brandName = undefined;
  }

  // --------------------------------------------------------
  
  setTimeout(async () => {
    
    await browser.close();
  }, 2000);

  // console.log(`allracketnames 
  // ${JSON.stringify(data, null, '  ')}`)
};

module.exports = scrape;