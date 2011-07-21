var biz = require('biz/entity.js');
var db = require("google/appengine/ext/db");
var util = require('biz/lib/utils');
var CONSTANTS = require('constants');
var {dump} = require('jsutils/jsutils');

exports.showform = function(entityName){
  return function(env){
    var properties = biz(env).getEntityProperties(entityName);
    var propsArray = [];
    for(var key in properties) {
      var propertyName = key;
      var propertyType = util.getPropertyType(properties[key]);
      propsArray.push({name: CONSTANTS.FORM_EL_PREFIX+propertyName, label: propertyName, type: propertyType});
    }
    var entity = null;
    if(env.req.params['id']) {
        entity = biz(env).getEntityById(env.req.params['id']);
    }
    if(env.req.isGet){
        if(entity){
            return {
                entityName: entityName,
                propsArray: propsArray,
                entity: entity
            };
        } else
            return {
              entityName: entityName,
              propsArray: propsArray
            };
    }
    if(env.req.isPost){
        if(!entity){
            entity = biz(env).createNewEntity(entityName);
        }
        util.fillEntityFromRequestParams(entity, env.req.params);
        biz(env).saveEntity(entity);
        return {
            status: 'redirect',
            url: '/admin/'+entityName.toLowerCase()+'s'
        };
    }
  }
}

