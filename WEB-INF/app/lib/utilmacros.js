
exports.equality_macro = function() {
  var params = arguments[0].parameters;
  print(params[0] + ' ---- '+params[1]);
  return params[0] == params[1];
}