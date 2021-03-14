// helper function for dynamic path/routing on web server
// checks for a path after the baseurl and return it

const normalizePath = require('normalize-path');
const regex = RegExp('.com');

if ( regex.test(__dirname) ) {
  exports.dynamicURL = normalizePath(__dirname.split('.com')[1].split('helpers')[0], false);
} else {
  exports.dynamicURL = '/';
}