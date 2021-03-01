const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const passport = require('passport');
const dynamicUrl = require('../helpers/dynamicRoutes').dynamicURL;

const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  eMail: {type: String, default: 'noEmail'}
});

const UserModel = mongoose.model('User', UserSchema);
exports.userModel = UserModel;

exports.registerUser = async (req, username, password, passwordConfirm, eMail) => {
  const registerErrors = {};
  const checkDuplicateUser = await UserModel.exists({username: username});
  if (checkDuplicateUser) registerErrors.username = 'Nutzername wird bereits verwendet !';

  if (password.length < 6) {
    registerErrors.password = 'Passwort musss mindestens 6 Zeichen lang sein !';
  } else if (password !== passwordConfirm) {
    registerErrors.password = 'Passwörter stimmen nicht überein !';
  }

  console.log('hashing now');
  const hashedPassword = await bcrypt.hash(password, 10);
  const saveuser = new UserModel({
    username,
    'password': hashedPassword,
    eMail
  });

  await saveuser.save( (err, saveuser) => {
    if (err || registerErrors) {
      registerErrors.save = 'Fehler beim speichern der Daten';
      return err;
    }
    console.log('saved ' + saveuser.username);
  });
  
  if (registerErrors) {
    return {status: false, registerErrors};
  } else {
    return { status: true};
  }
};

exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) console.error(err);
    if (user) {
      req.login(user, (err) => {
        if (err) return err;
        req.flash('authSuccess', 'Login erfolgreich !');
        res.redirect(`${dynamicUrl}dashboard`);
      });
    } else {
      req.flash('authError', `${info.message}`);
      res.redirect(`${dynamicUrl}login`);
    }
    console.log(user);
    console.log('info:\n' +info);
  })(req, res, next);
};

exports.isAuthenticated = {
  checkAuth: (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('authError', 'Zugang verweigert, bitte einloggen !');
    res.redirect(`${dynamicUrl}login`);
  }
};