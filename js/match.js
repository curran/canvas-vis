//@ sourceMappingURL=match.map
// Generated by CoffeeScript 1.6.1
(function() {

  define([], function() {
    var match;
    return match = function(property, fns, fnName) {
      if (fnName == null) {
        fnName = 'obj';
      }
      return function(obj) {
        var fn, key;
        key = obj[property];
        fn = fns[key];
        if (fn) {
          return fn.apply(null, arguments);
        } else {
          throw Error("no match for " + fnName + "." + property + " = " + key);
        }
      };
    };
  });

}).call(this);
