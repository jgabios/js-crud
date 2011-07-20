var CONSTANTS = require('constants');

exports.action = require('action').action({
    "skin": "contact.html",
    "getContext": function(env){
        return {
            page: {
                title: CONSTANTS.APP_NAME+' - contact me'
                }
        };
    }
});
