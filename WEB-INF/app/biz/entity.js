var model = require('model');
var CONSTANTS = require('constants');
var db = require("google/appengine/ext/db");

var saveEntity = function(entity){
// some checks for code not empty, author's email, etc ...
    entity.put();
    return true;
}

var getAllEntities = function(entityName){
 return model[entityName].all().fetch();
}

var getEntityProperties = function(entityName) {
  return model[entityName].properties();
}

var getEntityByAttribute = function(entityName, attributeName, attributeValue){
    var entities = model[entityName].query().equals(attributeName, attributeValue).fetch();
    if(entities && entities.length>0)
        return entities[0];
    else
        return null;
}

var getPageEntities = function(entityName, currentPage) {
  print('entityName = '+entityName);
  print('model[entityName] = '+model[entityName]);
  var query = new db.Query(model[entityName]);
  return query.limit(CONSTANTS.ENTITIES_PER_PAGE).offset(currentPage*CONSTANTS.ENTITIES_PER_PAGE).fetch();
}

var getNumberOfEntities = function(entityName) {
  return 100;
}

var createNewEntity = function(entityName) {
  return new model[entityName]();
}
var getEntityById = function(entityName, id){
  return model[entityName].get(id);
}

var deleteEntity = function(entity) {
  entity.remove();
}

exports = require('biz/lib/bizexports').bizexport(this);

exports.admin = require('biz/lib/simplemoduleexport').simpleexport(this);