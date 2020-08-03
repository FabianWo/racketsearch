const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let brandname;

const racketSchema = new Schema({
  racketName: String,
  racketPictureLink: String,
  racketSpecs: {
    ["Head Size:"]: {type: String, default: 'Not available'},
    ["Length:"]: {type: String, default: 'Not available'},
    ["Strung Weight:"]: {type: String, default: 'Not available'},
    ["Balance:"]: {type: String, default: 'Not available'}, 
    ["Swingweight:"]: {type: String, default: 'Not available'},
    ["Stiffness:"]: {type: String, default: 'Not available'},
    ["Beam Width:"]: {type: String, default: 'Not available'}, 
    ["Composition:"]: {type: String, default: 'Not available'},
    ["Power Level:"]: {type: String, default: 'Not available'},
    ["Stroke Style:"]: {type: String, default: 'Not available'},
    ["Swing Speed:"]: {type: String, default: 'Not available'},
    ["Racquet Colors:"]: {type: String, default: 'Not available'},
    ["Grip Type:"]: {type: String, default: 'Not available'},
    ["String Pattern:"]: {type: String, default: 'Not available'},
    ["String Tension:"]: {type: String, default: 'Not available'},
  },
  veraltet: Boolean, default: false
});

// clear cache and get correct name for collection
const exportModel = (modelBrandName) => {
  delete require.cache[require.resolve(`${modelBrandName}`).brandName];
  brandname = require(`${modelBrandName}`).brandName;
  return mongoose.model(brandname, racketSchema, brandname.toLowerCase());
};

module.exports = exportModel;