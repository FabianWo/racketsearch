const scraper = require('puppeteer');

exports.scrapeData = async (browser, page, allRacketLinks) => {
  // junior exclusion maybe
  const allRacketNames = await (await page.$$eval('a.name', (el) => el.map((el) => el.innerHTML)
    .filter((el) => !el.includes('Junior'))
    .filter((el) => !el.includes('2-Pack'))
  ));
  

  // -----------------------------------------------------------
  // in loop umbauen

  // await page.goto(allRacketLinks[0]);
  
  // get/define racketname, picture, statistics
  // const racketName = allRacketNames[0];
  // const racketPictureLink = await page.$eval('.mainimage', (img) => {
  //   return img.getAttribute('src');
  // });
  // const racketSpecs = await page.$eval('.rac_specs tbody', el => {
  //   const finalSpecs = {};
  //   const specTableElements = [...el.querySelectorAll('.SpecsLt, .SpecsDk')];
  //   const specText = specTableElements.forEach((el) => {
  //     const txtSplit = el.innerText.split('\n');
  //     finalSpecs[txtSplit[0]] = txtSplit[1];
  //   });
  //   return finalSpecs;
  // });

  //--------------------LOOP TESTESTESTESTESTTEST------------------

  console.log(allRacketLinks);
  const allRacketDataByBrand = [];
  let index = 0;
  for await (const link of allRacketLinks) {
    await page.goto(link);

    const racketName = allRacketNames[index];      
    
    const racketPictureLink = await page.$eval('.mainimage', (img) => img.getAttribute('src'));
    
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
    };
    
    index++;
    allRacketDataByBrand.push({racketName, racketPictureLink, racketSpecs});
  };

  // console.log(`allracketnames 
  // ${JSON.stringify(allRacketDataByBrand, null, '  ')}
  // `)
  // ----------------------------------------------------------
  setTimeout(async () => {
    
    await browser.close();
  }, 5000);

  return allRacketDataByBrand;

  // console.log(`
  //   ${racketName}
  //   ${racketPictureLink}
  //   ${racketSpecs}
  // `);


}