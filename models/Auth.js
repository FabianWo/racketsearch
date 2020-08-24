const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const userDatabase = require(mongoose.)

exports.LocalAuthStrategy = (req, res) => {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
};

exports.ExecuteAuth = async (req, res) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }, (req, res) => {
    console.log('success');
    res.render('index', {login: true});
  });
};

