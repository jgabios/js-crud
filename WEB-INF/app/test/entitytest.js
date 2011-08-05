
// addRepository in order for require to find files on the path
require('ringo/engine').addRepository("./");

var base = require('test/lib/base');
var model1 = require('test/models/model1');
var biz = require('biz/entity').admin;
var util = require('biz/lib/utils');

/**
 * test creation, insertion of entities
 */
base.test(function(){
  var entities = biz.getManageableEntities(), allEntities;
  for(var i=0;i<entities.length;i++){
    allEntities = biz.getAllEntities(entities[i]);
    var entity = biz.createNewEntity(entities[i]);
    util.fillEntityWithDummyData(entity);
    biz.saveEntity(entity, true);
    allEntities = biz.getAllEntities(entities[i]);
  }
});