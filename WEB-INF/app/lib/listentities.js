var CONSTANTS = require('constants');
var biz = require('biz/entity.js').admin;
var model = require('model');

exports.list = function(entityName){
        return function(env){
          if(env.req.params['ids']){
              var ids = env.req.params['ids'];
              for(var i=0,l = ids.length; i<l; i++) {
                var entity = biz.getEntityById(entityName, ids[i]);
                biz.deleteEntity(entity);
              }
          }

          var currentPage = env.req.params["currentPage"] ? parseInt(env.req.params["currentPage"]) : 0;

          var numberOfEntities = biz.getNumberOfEntities(entityName);
          var showNext = numberOfEntities>=(currentPage+1)*CONSTANTS.ENTITIES_PER_PAGE;
          var showPrevious = currentPage >= 1;
          var entities = biz.getPageEntities(entityName, currentPage);
          var prev = currentPage-1;
          
          var properties = Object.keys(biz.getEntityProperties(entityName));
          
          var config = model.Config;
          for(var key in config) {
            if(config[key]['relation']) {
              if(config[key]['relation']['child'] === entityName) {
                properties.push(config[key]['relation']['parent']);
                for(var i=0; i<entities.length; i++){
                  var relatedEntities = [];
                  var relatedEntityMaps = biz.getEntitiesByAttribute(key, entityName.toLowerCase(), entities[i]);
                  for(var k=0;k<relatedEntityMaps.length;k++) {
                    relatedEntities.push(relatedEntityMaps[k][config[key]['relation']['parent'].toLowerCase()]);
                  }
                  entities[i][config[key]['relation']['parent']] = relatedEntities;
                }
              }
            }
          }
          
          return {
              entityName: entityName,
              entities: entities,
              properties: properties,
              next: ++currentPage,
              prev: prev,
              showNext: showNext,
              showPrevious: showPrevious,
              colNo: properties.length+1
          };
        }
    }