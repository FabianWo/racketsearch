const scraper = require('puppeteer');
const mongoose = require('mongoose');
// const e = require('express');

exports.scrapeData = async (browser, page, allRacketLinks, brandName) => {

  // junior rackets exclusion
  const allRacketNames = await (await page.$$eval('a.name', (el) => el.map((el) => el.innerHTML)
    .filter((el) => !el.includes('Junior'))
    .filter((el) => !el.includes('2-Pack'))
  ));
  
  // wenn document nicht in allracketnames enthalten ist, löschen oder als veraltet klassifizieren
  const RacketSchema = require('./DbSchema')();
  const updateRacketList = await RacketSchema.find();
  updateRacketList.forEach( async (racket) => {
    console.log(racket.racketName);
    // console.log(!allRacketNames.includes(racket.racketName));
    if (!allRacketNames.includes(racket.racketName)) {
      console.log('update');
      await RacketSchema.updateOne({'racketName': racket.racketName}, {'veraltet': true});
    }
  });  
  
  //--------------------SCRAPE RACKETS, STORE IN DB------------------

  // helpers for loop and final data
  const allRacketDataByBrand = [];
  let index = 0;

  // single Racket scrape, and data storage
  for await (const link of allRacketLinks) {
    await page.goto(link);

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
    }).catch((err) => console.log(err));
    if (racketSpecs === undefined) {
      racketSpecs = 'no specs available';
    }
    index++;

    // store data
    const RacketSchema = require('./DbSchema')();
    const saveRacket = new RacketSchema({racketName, racketPictureLink, racketSpecs});

    // dann für jeden racket findoneandupdate(), wenn nichts gefunden await save
    
    RacketSchema.findOneAndUpdate({racketName: `${saveRacket.racketName}`}, {
      'racketPictureLink': saveRacket.racketPictureLink,
      'racketSpecs': saveRacket.racketSpecs
    },
    {new: true},
    async (err, doc) => {
      if (err) {
        console.error(err);
      } else if (doc) {
        // console.log('updated ' + doc);
        // console.log('updatedPIC ' + doc.racketPictureLink);
      } else {
        await saveRacket.save( (err, saveRacket) => {
          if (err) return err;
          console.log(`succesfully saved ${saveRacket.racketName}`);
        });

      }
    });

    allRacketDataByBrand.push({racketName, racketPictureLink, racketSpecs});
  }

  // console.log(`allracketnames 
  // ${JSON.stringify(allRacketDataByBrand, null, '  ')}
  // `)
  // ----------------------------------------------------------

  // setTimeout(async () => {
    
    //   await browser.close();
    // }, 2000);
  

  return allRacketDataByBrand;
};