var CONSTANTS = require('constants');
var biz = require('biz/entity');
var bizCateg = require('biz/categ');

exports.action = require('action').action({
    "skin": "index.html",
    "getContext": function(env){
      var parent = biz(env).getEntityByAttribute('Category', 'name', 'tata');
      var allCategs = bizCateg(env).getCategByParent(parent);
      return {
          categs: allCategs
      };
    }
});
