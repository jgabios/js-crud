var biz = require('biz/entity.js');
var db = require("google/appengine/ext/db");
var util = require('biz/lib/utils');
var CONSTANTS = require('constants');
var {dump} = require('jsutils/jsutils');
var strings = require('ringo/utils/strings');

exports.showform = function(entityName){
  return function(env){
    var properties = biz(env).getEntityProperties(entityName);
    var references = {};
    var propsArray = [];
    for(var key in properties) {
      var propertyName = key;
      var propertyType = util.getPropertyType(properties[key]);
      propsArray.push({name: CONSTANTS.FORM_EL_PREFIX+propertyName, label: propertyName, type: propertyType});
      if(propertyType === 'ReferenceProperty') {
          references[propertyName] = biz(env).getAllEntities(strings.capitalize(properties[key].referenceClass.kind()));
      }
    }
    
    var entity = null;
    if(env.req.params['id']) {
        entity = biz(env).getEntityById(entityName, env.req.params['id']);
    }
    if(env.req.isGet){
        if(entity){
            return {
                entityName: entityName,
                propsArray: propsArray,
                references: references,
                entity: entity
            };
        } else {
            return {
              entityName: entityName,
              propsArray: propsArray,
              references: references
            };
        }
    }
    if(env.req.isPost){
        var isNew = false;
        if(!entity){
            entity = biz(env).createNewEntity(entityName);
            isNew = true;
        }
        util.fillEntityFromRequestParams(entity, env.req.params);
        biz(env).saveEntity(entity, isNew);
        return {
            status: 'redirect',
            url: '/admin/'+entityName.toLowerCase()+'s'
        };
    }
  }
}

