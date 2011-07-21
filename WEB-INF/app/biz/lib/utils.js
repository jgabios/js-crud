var db = require("google/appengine/ext/db");
var bizEntity = require('biz/entity.js').admin;
var CONSTANTS = require('constants');

exports.getPropertyType = function(property) {
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

exports.fillEntityFromRequestParams = function(entity, params) {
    var entityName = bizEntity.getEntityKind(entity);
    var props = bizEntity.getEntityProperties(entityName);
    for(var prop in props) {
        entity[prop] = params[CONSTANTS.FORM_EL_PREFIX+prop];
    }
}