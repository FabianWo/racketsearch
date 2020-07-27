const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/", controller.home);
router.get('/search/', controller.redirect);
router.post('/search/', controller.redirect);
router.get('/search/:searchqueries', controller.displayScrapeData);
router.get('/search/scrape/:searchqueries', controller.getScrapeData);

module.exports = router;