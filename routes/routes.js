const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const checkAuthenticated = require('../models/HandleUsers').isAuthenticated.checkAuth;

// regular routes
router.get("/", controller.home);
router.post("/", controller.home);
router.get('/search/', controller.redirect);
router.post('/search/', controller.redirect);
router.get('/favicon.ico', (req, res) => res.status(200));
router.get('/search/:searchqueries', controller.displayScrapeData);
router.get('/scrape/:searchqueries', controller.getScrapeData);
router.get('/dashboard', checkAuthenticated, controller.dashboard );

// authentication / user routes
router.get('/login', controller.login);
router.post('/login', controller.login);
router.get('/logout', controller.logout);
router.get('/register', controller.register);
router.post('/register', controller.register);

module.exports = router;