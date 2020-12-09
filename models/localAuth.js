const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('./HandleUsers').userModel;

const mongoose = require('mongoose');

exports.initializePassport = (passport) => {
  passport.use(
    new LocalStrategy( async (username, password, done) => {
      await UserModel.findOne({ username: username }, async (err, user) => {
        if (err) return done(err);
        if (!user) {
          return done(null, false , { message: 'Benutzer existiert nicht !' });
        }
        if (!await bcrypt.compare(password, user.password)) {
          return done(null, false, { message: 'Falsches passwort !' });
        }
        console.log('user gefunden');
        return done(null, user);
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log('Serialize user called.');
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    console.log('Deserialize user called.');
    UserModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

