var CONSTANTS = require('constants');
var model = require("model");


var getAllCategs = function(){
 return model.Category.all().fetch();
}
    
exports = require('biz/lib/bizexports').bizexport(this);
exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);
