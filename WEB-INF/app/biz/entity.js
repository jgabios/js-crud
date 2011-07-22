var model = require('model');
var CONSTANTS = require('constants');
var db = require("google/appengine/ext/db");
var strings = require('ringo/utils/strings');

var saveEntity = function(entity, isNew){
// some checks for code not empty, author's email, etc ...
    entity.put();
    if(isNew) {
        increaseCounterForKind(getEntityKind(entity));
    }
    return true;
}

var getAllEntities = function(entityName){
 return model[entityName].all().fetch();
}

var getEntityProperties = function(entityName) {
  return model[entityName].properties();
}

var getEntityKind = function(entityInstance) {
    return strings.capitalize(entityInstance.constructor.kind());
}

var getEntityByAttribute = function(entityName, attributeName, attributeValue){
    var entities = model[entityName].query().filter(attributeName+' =', attributeValue).fetch();
    if(entities && entities.length>0)
        return entities[0];
    else
        return null;
}

var getPageEntities = function(entityName, currentPage) {
  var query = new db.Query(model[entityName]);
  return query.limit(CONSTANTS.ENTITIES_PER_PAGE).offset(currentPage*CONSTANTS.ENTITIES_PER_PAGE).fetch();
}

var getNumberOfEntities = function(entityName) {
  var query = new db.Query(model[CONSTANTS.COUNTER_MODEL]);
  query.filter('entityName =', entityName);
  var counter = query.fetch()[0];
  return counter['counter'];
}

var increaseCounterForKind = function(entityName) {
  var query = new db.Query(model[CONSTANTS.COUNTER_MODEL]);
  query.filter('entityName =', entityName);
  var counter = query.fetch()[0];
  if(!counter) {
      counter = createNewEntity(CONSTANTS.COUNTER_MODEL);
      counter['counter'] = 0;
      counter['entityName'] = entityName;
  }
  counter['counter'] = counter['counter'] +1;
  counter.put();
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