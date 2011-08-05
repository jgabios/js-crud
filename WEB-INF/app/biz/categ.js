var model = require('model');
var CONSTANTS = require('constants');
var db = require("google/appengine/ext/db");
var biz = require('biz/entity').admin;

var entityName = 'Category';

var getCategByParent = function(parent) {
    return biz.getEntitiesByAttribute(entityName, 'parentCategory', parent);
}

exports = require('biz/lib/bizexports').bizexport(this);
exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);