var db = require("google/appengine/ext/db");

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