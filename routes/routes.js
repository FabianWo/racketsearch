const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/", controller.home);
router.post('/scrape/', controller.redirect);
router.get('/scrape/:searchqueries', controller.displayScrapeData);

module.exports = router;


// next: 
// 1. make mixin for feed
// 2. setup puppeteer
//   1. find links/screenshot
//   2. save
// 4. populate mixin with data