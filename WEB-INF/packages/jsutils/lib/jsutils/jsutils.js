var dump = exports.dump = function(obj){
 for(var key in obj){
  print(key + ' - ' +obj[key]);
 }
}

var folderPathAppend = exports.folderPathAppend = function(folder) {
 var rez = folder;
 if(folder.charAt(folder.length-1) !== '/'){
  rez = folder + '/';
 }
 return rez;
}

