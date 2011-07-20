var CONSTANTS = require('constants');
var bizCategs = require('biz/categs');

exports.action = require('action').action({
    "skin": "index.html",
    "getContext": function(env){
        var allCategs = bizCategs(env).getAllCategs();
        return {
            categs: allCategs
        };
    }
});
