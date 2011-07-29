var CONSTANTS = require('constants');
var biz = require('biz/entity');

exports.action = require('action').action({
    "skin": "index.html",
    "getContext": function(env){
        var allCategs = biz(env).getAllEntities('Category');
        return {
            categs: allCategs
        };
    }
});
