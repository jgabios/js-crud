var CONSTANTS = require('constants');
var biz = require('biz/entity');

exports.action = require('action').action({
    "skin": "admin/index.html",
    "getContext": function(env){
      return {
          entities: biz(env).getManageableEntities(),
          version: CONSTANTS.VERSION
      };
    }
});
