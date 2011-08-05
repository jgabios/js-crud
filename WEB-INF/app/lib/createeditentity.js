var biz = require('biz/entity.js');
var model = require('model');
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
    
    var config = model.Config;
    for(var key in config) {
      if(config[key]['relation']) {
        if(config[key]['relation']['child'] === entityName) {
          propsArray.push({name: CONSTANTS.FORM_EL_PREFIX + config[key]['relation']['parent'], label: config[key]['relation']['parent'], type: 'ManyToManyReference'});
          references[config[key]['relation']['parent']] = biz(env).getAllEntities(config[key]['relation']['parent']);
        }
      }
    }
    
    var entity = null;
    entity = biz(env).getEntityById(entityName, env.req.params['id']);
    if(env.req.isGet){
        if(entity){
            var config = model.Config;
            for(var key in config) {
              if(config[key]['relation']) {
                if(config[key]['relation']['child'] === entityName) {
                    var relatedEntities = [];
                    var relatedEntityMaps = biz(env).getEntitiesByAttribute(key, entityName.toLowerCase(), entity);
                    for(var k=0;k<relatedEntityMaps.length;k++) {
                      relatedEntities.push(relatedEntityMaps[k][config[key]['relation']['parent'].toLowerCase()]);
                    }
                    entity[config[key]['relation']['parent']] = relatedEntities;
                }
              }
            }
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
        var deletableAuxiliaryentities = util.getAuxiliaryEntities(entity);
        if(deletableAuxiliaryentities && deletableAuxiliaryentities.length>0) {
          print('de sters '+deletableAuxiliaryentities.length);
          for(var i=0; i< deletableAuxiliaryentities.length; i++) {
            biz(env).deleteEntity(deletableAuxiliaryentities[i]);
          }
        }
        var auxiliarentities = util.fillEntityFromRequestParams(entity, env.req.params);
        biz(env).saveEntity(entity, isNew);
        if(auxiliarentities && auxiliarentities.length>0) {
          for(var i=0; i< auxiliarentities.length; i++) {
            auxiliarentities[i][entityName.toLowerCase()] = entity;
            biz(env).saveEntity(auxiliarentities[i], true);
          }
        }
        return {
            status: 'redirect',
            url: '/admin/'+entityName.toLowerCase()+'s'
        };
    }
  }
}

