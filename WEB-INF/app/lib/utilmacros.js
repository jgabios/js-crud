
var webenv = require('ringo/webapp/env');

exports.equality_macro = function() {
  var params = arguments[0].parameters;
  return params[0] == params[1];
}

exports.equalKeys_macro = function() {
  var params = arguments[0].parameters;
  if(params[0].key().id() === params[1].key().id()) {
    return params[2];
  } else {
    return '';
  }
}

exports.getObjVal_macro = function(){
  var params = arguments[0].parameters;
  var obj = params[0];
  var key = params[1];
  return obj[key];
};

exports.getEntityValue_macro = function(){
  var params = arguments[0].parameters;
  var obj = params[0];
  var key = params[1];
  if(obj[key] && obj[key].hasKey instanceof Function) {
      return "<a href=\"#\" title=\"key="+obj[key].key()+"\">"+obj[key].name+"</a>";
  } else {
      if(obj[key] && obj[key] instanceof Array) {
        var result = '';
        for(var i=0; i<obj[key].length; i++) {
          var object = obj[key][i];
          if(object.hasKey instanceof Function) {
            result += "<a href=\"#\" title=\"key=" + object.key()+"\">" + object.name + "</a> , ";
          } else {
            result += object;
          }
        }
        return result;
      } else {
        return obj[key];
      }
  }
}

exports.hasValueForAttribute_macro = function(){
  var params = arguments[0].parameters;
  var obj = params[0];
  var attribute = params[1];
  var value = params[2];
  var returnString = params[3];
  if(obj[attribute]==value)
    return returnString;
  else
    return '';
};

exports.isValueInAttribute_macro = function(){
  var params = arguments[0].parameters;
  var obj = params[0];
  var attribute = params[1];
  var value = params[2];
  var returnString = params[3];
  if(obj[attribute].indexOf(value)>-1)
    return returnString;
  else
    return '';
};

exports.getValueOfObjectAttributeInArray_macro = function(){
  var params = arguments[0].parameters;
  var obj_array = params[0];
  var attribute = params[1];
  for(var i=0,l=obj_array.length;i<l;i++){
    var obj = obj_array[i];
    if(attribute==obj.denumire){
      return obj.valoare;
    }
  }
};

exports.isCheckedForEntity_macro = function(){
  var params = arguments[0].parameters;
  var obj_array = params[0];
  var entity = params[1];
  var returnString = params[2];
  for(var i=0,l=obj_array.length; i<l; i++){
    var obj = obj_array[i];
    if(entity.key().id() === obj.key().id()){
      return returnString;
    }
  }
  return '';
};

exports.hasValueOfObjectAttributeInArray_macro = function(){
  var params = arguments[0].parameters;
  var obj_array = params[0];
  var attribute = params[1];
  var valueToCheck = params[2];
  var returnString = params[3];
  for(var i=0,l=obj_array.length;i<l;i++){
    var obj = obj_array[i];
    if(attribute==obj.denumire){
      if(obj.valoare==valueToCheck){
        return returnString;
      } else {
        return '';
      }
    }
  }
};

exports.aisEqual_macro = function(){
  var params = arguments[0].parameters;
  var val1 = params[0];
  var val2 = params[1];
  var returnString = params[2];
  if(val1 == val2)
    return returnString;
  else
    return '';
};

exports.sortSelectMacro_macro = function(){
  var params = arguments[0].parameters;
  var obj = params[0];
  if(!obj)
      return '';
  var field = params[1]+params[2];
  if(obj['way']+'_'+obj['customfield']===field)
    return 'selected';
  else
      return '';
};

exports.fulluri_macro = function(tag) {
 var req = webenv.getRequest();
 var res = req.path;
 if(req.queryString)
  res+='?'+req.queryString;
 return res;
}

exports.specialhref_macro = function(tag) {
 var req = webenv.getRequest();
 var res = req.path;
 res = res.replace('/anunturi/','/');
 return res;
}

exports.pagfulluri_macro = function(tag) {
 var req = webenv.getRequest();
 var res = req.path;
 if(req.queryString)
  res+='?'+req.queryString;
 res=res.replace(/&pageId=\d+/,'');
 return res;
}

exports.isFilterChecked_macro = function(tag) {
 var req = webenv.getRequest();
 var params = arguments[0].parameters;
  var name = params[0];
  var value = params[1];
  if(unescape(req.queryString).indexOf('filter_'+name+'[]='+value)>=0)
      return 'checked';
  else
      return '';
}

exports.isFilterSelected_macro = function(tag) {
 var req = webenv.getRequest();
 var params = arguments[0].parameters;
  var name = params[0];
  var value = params[1];
  if(unescape(req.queryString).indexOf('filter_'+name+'[]='+value)>=0)
      return 'selected';
  else
      return '';
}
