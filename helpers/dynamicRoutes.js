// helper variable for dynamic path/routing
// const express = require("express");
// const path = require('path');
const normalizePath = require('normalize-path');

if ( __dirname.search('/.com/g') !== -1 ) {
  exports.dynamicURL = normalizePath(__dirname.split('.com')[1].split('helpers')[0]);
  console.log('yes   ' + this.dynamicURL);
} else {
  exports.dynamicURL = '/';
  console.log('no');
}

console.log(this.dynamicURL);