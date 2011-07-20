var CONSTANTS = require('constants');
var biz = require('biz/entity.js').admin;

exports.action = require('action').action({
    "skin": "admin/listentities.html",
    "getContext": require('lib/listentities').list('Category')
});