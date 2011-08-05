var db = require("google/appengine/ext/db");
var bizEntity = require('biz/entity.js').admin;
var model = require('model');
var CONSTANTS = require('constants');
var strings = require('ringo/utils/strings');

var getPropertyType = exports.getPropertyType = function(property) {
  var type = null;
  if(property instanceof db.TextProperty){
   type = 'TextProperty';
  }
  if(property instanceof db.StringProperty){
   type = 'StringProperty';
  }
  if(property instanceof db.ReferenceProperty){
   type = 'ReferenceProperty';
  }
  if(property instanceof db.IntegerProperty){
   type = 'IntegerProperty';
  }
  return type;
}

/**
 * Returns entities related to the entity passed as parameter to this function.
 * example: entity = product, and getAuxiliaryEntities will return category entities in which the product exists
 * 
 */
exports.getAuxiliaryEntities = function(entity) {
  var auxiliarEntities = [];
  var config = model.Config;
  var entityName = bizEntity.getEntityKind(entity);
  for(var key in config) {
    if(config[key]['relation']) {
      if(config[key]['relation']['child'] === entityName) {
        var auxiliarEntities = bizEntity.getEntitiesByAttribute(key, entityName.toLowerCase(), entity);
        auxiliarEntities = auxiliarEntities.concat(auxiliarEntities);
      }
    }
  }
  return auxiliarEntities;
}

exports.fillEntityFromRequestParams = function(entity, params) {
    var auxiliarEntities = [];
    var entityName = bizEntity.getEntityKind(entity);
    var props = bizEntity.getEntityProperties(entityName);
    for(var prop in props) {
        if(getPropertyType(props[prop]) === 'ReferenceProperty') {
            if(params[CONSTANTS.FORM_EL_PREFIX + prop]) {
                entity[prop] = bizEntity.getEntityById(strings.capitalize(props[prop].referenceClass.kind()), params[CONSTANTS.FORM_EL_PREFIX+prop])
            }
        } else {
            entity[prop] = params[CONSTANTS.FORM_EL_PREFIX+prop];
        }
    }
    var config = model.Config;
    for(var param in params) {
      var propKey = param.replace(CONSTANTS.FORM_EL_PREFIX, '');
      if(!(propKey in props)) {
        for(var key in config) {
          if(config[key]['relation']) {
            if(config[key]['relation']['child'] === entityName && config[key]['relation']['parent'] === propKey) {
              if(params[param] instanceof Array) {
                for(var j=0; j<params[param].length; j++){
                  var childKey = config[key]['relation']['child'].toLowerCase();
                  var parentKey = config[key]['relation']['parent'].toLowerCase();
                  var filter = {};
                  filter[childKey] = entity;
                  filter[parentKey] = bizEntity.getEntityById(config[key]['relation']['parent'], params[param][j]);
                  var auxiliarEntity = bizEntity.getEntityByAttributes(key, filter);
                  if(!auxiliarEntity) {
                    auxiliarEntity = bizEntity.createNewEntity(key);
                  }
                  auxiliarEntity[config[key]['relation']['parent'].toLowerCase()] = bizEntity.getEntityById(config[key]['relation']['parent'], params[param][j]);
                  auxiliarEntities.push(auxiliarEntity);
                }
              } else {
                var auxiliarEntity = bizEntity.createNewEntity(key);
                auxiliarEntity[config[key]['relation']['parent'].toLowerCase()] = bizEntity.getEntityById(config[key]['relation']['parent'], params[param]);
                auxiliarEntities.push(auxiliarEntity);
              }
            }
          }
        }
      }
    }
    return auxiliarEntities;
}

exports.fillEntityWithDummyData = function(entity) {
    var entityName = bizEntity.getEntityKind(entity);
    var props = bizEntity.getEntityProperties(entityName);
    for(var prop in props) {
      entity[prop] = getDummyDataForProperty(props[prop]);
    }
}

var getDummyDataForProperty = function(property) {
  var data = null;
  var type = getPropertyType(property);
  switch(type) {
    case 'TextProperty':
    case 'StringProperty': {
      data = 'DummyData';
      break;
    }
    case 'IntegerProperty': {
      data = 1;
      break;
    }
    case 'ReferenceProperty': {
      data = null;
      break;
    }
  }
  return data;
}