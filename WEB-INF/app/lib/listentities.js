var CONSTANTS = require('constants');
var biz = require('biz/entity.js').admin;

exports.list = function(entityName){
        return function(env){
          if(env.req.params['id']){
              var entity = biz.getEntityById(entityName, env.req.params['id']);
              biz.deleteEntity(entity);
          }

          var currentPage = env.req.params["currentPage"] ? parseInt(env.req.params["currentPage"]) : 0;

          var numberOfEntities = biz.getNumberOfEntities(entityName);
          var showNext = numberOfEntities>=(currentPage+1)*CONSTANTS.ENTITIES_PER_PAGE;
          var showPrevious = currentPage >= 1;
          var entities = biz.getPageEntities(entityName, currentPage);
          var prev = currentPage-1;
          return {
              entityName: entityName,
              entities: entities,
              next: ++currentPage,
              prev: prev,
              showNext: showNext,
              showPrevious: showPrevious
          };
        }
    }