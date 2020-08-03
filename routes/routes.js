const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/", controller.home);
router.post("/", controller.home);
router.get('/search/', controller.redirect);
router.post('/search/', controller.redirect);
router.get('/favicon.ico', (req, res) => res.status(200));
router.get('/search/:searchqueries', controller.displayScrapeData);
router.get('/scrape/:searchqueries', controller.getScrapeData);

module.exports = router;