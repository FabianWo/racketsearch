// helper variable for dynamic path/routing
// const express = require("express");
// const path = require('path');
const normalizePath = require('normalize-path');
const regex = RegExp('.com');

if ( regex.test(__dirname) ) {
  exports.dynamicURL = normalizePath(__dirname.split('.com')[1].split('helpers')[0], false);
} else {
  exports.dynamicURL = '/';
}