const scraper = require('puppeteer');
const mongoose = require('mongoose');

exports.scrapeData = async (browser, page, allRacketLinks, brandName) => {

  // junior rackets exclusion
  const allRacketNames = await (await page.$$eval('a.name', (el) => el.map((el) => el.innerHTML)
    .filter((el) => !el.includes('Junior'))
    .filter((el) => !el.includes('2-Pack'))
  ));
  
  // wenn document nicht in allracketnames enthalten ist, löschen oder als veraltet klassifizieren
  const RacketModel = require('./DbSchema')('./ScraperSetup');
  const updateRacketList = await RacketModel.find();
  updateRacketList.forEach( async (racket) => {
    if (!allRacketNames.includes(racket.racketName)) {
      console.log('update ' + racket.racketName);
      await RacketModel.updateOne({'racketName': racket.racketName}, {'veraltet': true});
    }
  });  
  
  //--------------------SCRAPE RACKETS, STORE IN DB------------------

  // helpers for loop and final data
  // const allRacketDataByBrand = [];
  let index = 0;

  // single Racket scrape, and data storage
  for await (const link of allRacketLinks) {
    await page.goto(link);

    // -----------GET DATA------------

    // get racketname from given List
    const racketName = allRacketNames[index];      
    
    // pull out link to picture 
    const racketPictureLink = await page.$eval('.mainimage', (img) => img.getAttribute('src'));
    
    // pull out all specifications and store in 'racketspecs'
    let racketSpecs;
    racketSpecs = await page.$eval('.rac_specs tbody', el => {
      const finalSpecs = {};
      const specTableElements = [...el.querySelectorAll('.SpecsLt, .SpecsDk')];
      specTableElements.forEach((el) => {
        const txtSplit = el.innerText.split('\n');
        finalSpecs[txtSplit[0]] = txtSplit[1];
      });
      return finalSpecs;
    }).catch( err => console.log(err));

    if (racketSpecs === undefined) {
      racketSpecs = 'no specs available';
    }
    index++;

    // -----------STORE DATA------------

    const RacketModel = require('./DbSchema')('./ScraperSetup');
    const saveRacket = new RacketModel({racketName, racketPictureLink, racketSpecs});

    // dann für jeden racket findOneAndUpdate(), wenn nichts gefunden await save
    
    RacketModel.findOneAndUpdate({racketName: `${saveRacket.racketName}`},
    {
      'racketPictureLink': saveRacket.racketPictureLink,
      'racketSpecs': saveRacket.racketSpecs
    },
    {new: true},
    async (err) => {
      if (err) {
        console.error(err);
      } else {
        await saveRacket.save( (err, saveRacket) => {
          if (err) return err;
          console.log(`succesfully saved ${saveRacket.racketName}`);
        });
      }
    });
  }

  // console.log(`allracketnames 
  // ${JSON.stringify(allRacketDataByBrand, null, '  ')}
  // `);
  // ----------------------------------------------------------

  // setTimeout(async () => {
    
    //   await browser.close();
    // }, 2000);
};