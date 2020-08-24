const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: String,
  password: String,
  eMail: {type: String, default: 'noEmail'}
});

exports.registerUser = async (username, password, passwordConfirm, eMail) => {
  if (password !== passwordConfirm) return false;
  console.log('hashing now');
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const UserModel = mongoose.model('User', UserSchema);
  const saveuser = new UserModel({
    username,
    hashedPassword,
    eMail
  });

  await saveuser.save( (err, saveuser) => {
    if (err) return err;
    console.log('saved ' + saveuser.username);
  });
  return true;
};

// hash passowrd
// databse method for creating new user, check if username exists already
// run function to display success! / error! message