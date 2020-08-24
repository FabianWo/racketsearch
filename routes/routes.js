const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

// regular routes
router.get("/", controller.home);
router.post("/", controller.home);
router.get('/search/', controller.redirect);
router.post('/search/', controller.redirect);
router.get('/favicon.ico', (req, res) => res.status(200));
router.get('/search/:searchqueries', controller.displayScrapeData);
router.get('/scrape/:searchqueries', controller.getScrapeData);

// authentication / user routes
router.get('/login', controller.login);
router.post('/login', controller.login);
router.get('/register', controller.register);
router.post('/register', controller.register);

module.exports = router;