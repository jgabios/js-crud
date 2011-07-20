var CONSTANTS = require('constants');

exports.action = require('action').action({
    "skin": "admin/addentity.html",
    "getContext": require('lib/createeditentity').showform('Category')
});