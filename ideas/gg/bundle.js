;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var Interval, Mark, Scale, aestheticsFns, argsToOptions, compact, evaluate, evaluateAlgebra, extractElementStmts, extractKeys, first, genAestheticsFn, genGeometryFn, genRenderFns, geometryFns, getFile, map, match, parse, processCoordStmts, processDataStmts, processScaleStmts, processSourceStmts, show, tests, _;

  tests = require('./tests.coffee');

  getFile = require('./getFile.coffee');

  parse = (require('./parser')).parse;

  processSourceStmts = require('./processSourceStmts.coffee');

  processDataStmts = require('./processDataStmts.coffee');

  processScaleStmts = require('./processScaleStmts.coffee');

  processCoordStmts = require('./processCoordStmts.coffee');

  evaluateAlgebra = require('./evaluateAlgebra.coffee');

  show = require('./show.coffee');

  match = require('./match.coffee');

  Scale = require('./Scale.coffee');

  Interval = require('./Interval.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  first = _.first;

  argsToOptions = require('./argsToOptions.coffee');

  tests();

  getFile('gg/scatter.gg', function(err, expr) {
    return evaluate(expr, canvas);
  });

  Mark = function() {
    return {
      x: function(_x) {
        this._x = _x;
        return this;
      },
      y: function(_y) {
        this._y = _y;
        return this;
      },
      _size: 0.01,
      size: function(_size) {
        this._size = _size;
        return this;
      },
      render: function(ctx, w, h) {
        var radius, x, y;

        x = this._x * w;
        y = this._y * h;
        radius = this._size * (w + h) / 4;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        return ctx.fill();
      }
    };
  };

  evaluate = function(expr, canvas) {
    var ast;

    ast = parse(expr);
    return processSourceStmts(ast, function(err, vars) {
      var aesthetics, coords, ctx, geometry, key, keys, mark, renderFns, _i, _len, _ref, _results;

      vars = processDataStmts(ast, vars);
      ast = evaluateAlgebra(ast, vars);
      ast = processScaleStmts(ast);
      coords = processCoordStmts(ast);
      renderFns = genRenderFns(ast);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx = canvas.getContext('2d');
      _results = [];
      for (_i = 0, _len = renderFns.length; _i < _len; _i++) {
        _ref = renderFns[_i], keys = _ref.keys, geometry = _ref.geometry, aesthetics = _ref.aesthetics;
        _results.push((function() {
          var _j, _len1, _results1;

          _results1 = [];
          for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
            key = keys[_j];
            mark = Mark();
            mark = geometry(key, mark);
            mark = aesthetics(key, mark);
            _results1.push(mark.render(ctx, canvas.width, canvas.height));
          }
          return _results1;
        })());
      }
      return _results;
    });
  };

  genRenderFns = function(ast) {
    var elementStmts;

    elementStmts = extractElementStmts(ast);
    return map(elementStmts, function(_arg) {
      var fn, options;

      fn = _arg.fn;
      options = argsToOptions(fn.args);
      return {
        keys: extractKeys(fn),
        geometry: genGeometryFn(fn.name, options),
        aesthetics: genAestheticsFn(fn.name, options)
      };
    });
  };

  extractKeys = match({
    Fn: function(_arg) {
      var args, name;

      name = _arg.name, args = _arg.args;
      return first(map(args, extractKeys));
    },
    Relation: function(relation) {
      return relation.keys;
    },
    AST: function() {}
  });

  extractElementStmts = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return compact(map(stmts, extractElementStmts));
    },
    Element: function(e) {
      return e;
    },
    AST: function() {}
  });

  genGeometryFn = function(fnName, options) {
    return geometryFns[fnName](options);
  };

  geometryFns = {
    point: function(options) {
      var attrs, relation;

      if (options.position) {
        relation = options.position;
        attrs = relation.attributes;
        return function(key, mark) {
          if (attrs.length === 1) {
            return mark.x(relation.attributes[0].map[key]).y(0.5);
          } else if (attrs.length === 2) {
            return mark.x(relation.attributes[0].map[key]).y(relation.attributes[1].map[key]);
          }
        };
      } else {
        return function(key, mark) {
          return mark;
        };
      }
    }
  };

  genAestheticsFn = function(fnName, options) {
    return aestheticsFns[fnName](options);
  };

  aestheticsFns = {
    point: function(_arg) {
      var attr, maxSize, minSize, scale, size, sizes, unit;

      size = _arg.size;
      if (size) {
        minSize = 0.01;
        maxSize = 0.05;
        unit = new Interval(0, 1);
        sizes = new Interval(minSize, maxSize);
        scale = new Scale;
        attr = size.attributes[0];
        attr = scale.apply(attr);
        return function(key, mark) {
          var val;

          val = attr.map[key];
          return mark.size(unit.to(sizes, val));
        };
      } else {
        return function(key, mark) {
          return mark;
        };
      }
    }
  };

}).call(this);


},{"./tests.coffee":2,"./getFile.coffee":3,"./processSourceStmts.coffee":4,"./processDataStmts.coffee":5,"./processScaleStmts.coffee":6,"./processCoordStmts.coffee":7,"./evaluateAlgebra.coffee":8,"./show.coffee":9,"./match.coffee":10,"./Scale.coffee":11,"./Interval.coffee":12,"./argsToOptions.coffee":13,"./parser":14,"underscore":15}],15:[function(require,module,exports){
(function(){//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.4.4';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? null : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See: https://bugs.webkit.org/show_bug.cgi?id=80797
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value || _.identity);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    each(input, function(value) {
      if (_.isArray(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(concat.apply(ArrayProto, arguments));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(args, "" + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    var args = slice.call(arguments, 2);
    return function() {
      return func.apply(context, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
      previous = new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent, but `Object`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                               _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
        return false;
      }
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(n);
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

})()
},{}],3:[function(require,module,exports){
(function() {
  var getFile;

  getFile = function(path, callback) {
    return $.get(path, function(text) {
      return callback(null, text);
    });
  };

  module.exports = getFile;

}).call(this);


},{}],10:[function(require,module,exports){
(function() {
  module.exports = function(fns) {
    return function(obj) {
      var constructor, fn;

      constructor = obj.constructor;
      fn = fns[constructor.name];
      while (!fn && constructor.__super__) {
        constructor = constructor.__super__.constructor;
        fn = fns[constructor.name];
      }
      if (fn) {
        return fn.apply(this, arguments);
      } else {
        throw Error("no match for type " + constructor.name + ".");
      }
    };
  };

}).call(this);


},{}],13:[function(require,module,exports){
(function() {
  var argsToOptions;

  argsToOptions = function(args) {
    var fn, options, _i, _len;

    options = {};
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      fn = args[_i];
      if (fn.args.length === 1) {
        options[fn.name] = fn.args[0];
      } else {
        options[fn.name] = fn.args;
      }
    }
    return options;
  };

  module.exports = argsToOptions;

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  var assertEq, check, parse, show, tests;

  parse = (require('./parser.js')).parse;

  show = require('./show.coffee');

  tests = function() {
    check('DATA: x = y');
    check("DATA: x = y\nDATA: q = z");
    check('DATA: x = "sepal length"');
    check('SOURCE: "data/iris.csv"');
    check('ELEMENT: point(position(x*y))');
    check('ELEMENT: point(position(x+y))');
    check('ELEMENT: point(position(x/y))');
    check("SOURCE: \"data/iris.csv\"\nDATA: x = \"petal length\"\nDATA: y = \"sepal length\"\nSCALE: linear(dim(1))\nSCALE: linear(dim(2))\nCOORD: rect(dim(1, 2))\nGUIDE: axis(dim(1))\nGUIDE: axis(dim(2))\nELEMENT: point(position(x*y))");
    return console.log('All tests passed!');
  };

  check = function(expr) {
    return assertEq(show(parse(expr)), expr);
  };

  assertEq = function(actual, expected) {
    if (actual !== expected) {
      throw new Error("Expected '" + expected + "', got '" + actual + "'");
    }
  };

  module.exports = tests;

}).call(this);


},{"./parser.js":14,"./show.coffee":9}],12:[function(require,module,exports){
(function() {
  var Interval, type;

  type = require('./type.coffee');

  Interval = (function() {
    function Interval(min, max) {
      this.min = min;
      this.max = max;
      type(this.min, Number);
      type(this.max, Number);
    }

    Interval.prototype.span = function() {
      return this.max - this.min;
    };

    Interval.prototype.to = function(interval, value) {
      type(interval, Interval);
      type(value, Number);
      return (value - this.min) / this.span() * interval.span() + interval.min;
    };

    return Interval;

  })();

  module.exports = Interval;

}).call(this);


},{"./type.coffee":16}],14:[function(require,module,exports){
module.exports = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "stmt": parse_stmt,
        "data": parse_data,
        "source": parse_source,
        "fnStmt": parse_fnStmt,
        "expr": parse_expr,
        "fn": parse_fn,
        "args": parse_args,
        "arg": parse_arg,
        "op": parse_op,
        "primitive": parse_primitive,
        "name": parse_name,
        "str": parse_str,
        "num": parse_num,
        "ws": parse_ws
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_stmt();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_stmt();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, stmts) { return new Program(stmts); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_stmt() {
        var result0;
        
        result0 = parse_data();
        if (result0 === null) {
          result0 = parse_source();
          if (result0 === null) {
            result0 = parse_fnStmt();
          }
        }
        return result0;
      }
      
      function parse_data() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "DATA:") {
          result0 = "DATA:";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"DATA:\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ws();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ws();
          }
          if (result1 !== null) {
            result2 = parse_name();
            if (result2 !== null) {
              result3 = [];
              result4 = parse_ws();
              while (result4 !== null) {
                result3.push(result4);
                result4 = parse_ws();
              }
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 61) {
                  result4 = "=";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"=\"");
                  }
                }
                if (result4 !== null) {
                  result5 = [];
                  result6 = parse_ws();
                  while (result6 !== null) {
                    result5.push(result6);
                    result6 = parse_ws();
                  }
                  if (result5 !== null) {
                    result6 = parse_name();
                    if (result6 === null) {
                      result6 = parse_str();
                    }
                    if (result6 !== null) {
                      result7 = [];
                      result8 = parse_ws();
                      while (result8 !== null) {
                        result7.push(result8);
                        result8 = parse_ws();
                      }
                      if (result7 !== null) {
                        result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, left, expr) { return new Data(left.value, expr); })(pos0, result0[2], result0[6]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_source() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 7) === "SOURCE:") {
          result0 = "SOURCE:";
          pos += 7;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"SOURCE:\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ws();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ws();
          }
          if (result1 !== null) {
            result2 = parse_str();
            if (result2 !== null) {
              result3 = [];
              result4 = parse_ws();
              while (result4 !== null) {
                result3.push(result4);
                result4 = parse_ws();
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, csvPath) { return new Source(csvPath.value); })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_fnStmt() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "SCALE") {
          result0 = "SCALE";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"SCALE\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 5) === "COORD") {
            result0 = "COORD";
            pos += 5;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"COORD\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 5) === "GUIDE") {
              result0 = "GUIDE";
              pos += 5;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"GUIDE\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 7) === "ELEMENT") {
                result0 = "ELEMENT";
                pos += 7;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"ELEMENT\"");
                }
              }
            }
          }
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = [];
            result3 = parse_ws();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_ws();
            }
            if (result2 !== null) {
              result3 = parse_fn();
              if (result3 !== null) {
                result4 = [];
                result5 = parse_ws();
                while (result5 !== null) {
                  result4.push(result5);
                  result5 = parse_ws();
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, label, fn) { return FnStmt.create(label, fn); })(pos0, result0[0], result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_expr() {
        var result0;
        
        result0 = parse_fn();
        if (result0 === null) {
          result0 = parse_op();
          if (result0 === null) {
            result0 = parse_primitive();
          }
        }
        return result0;
      }
      
      function parse_fn() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (/^[a-z]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result1 === null) {
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-z]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-z]");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 46) {
                result1 = ".";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\".\"");
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result1 = parse_args();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, name, args) { return new Fn(name.join(''), args);})(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_args() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ws();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ws();
          }
          if (result1 !== null) {
            result2 = [];
            result3 = parse_arg();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_arg();
            }
            if (result2 !== null) {
              result3 = [];
              result4 = parse_ws();
              while (result4 !== null) {
                result3.push(result4);
                result4 = parse_ws();
              }
              if (result3 !== null) {
                if (input.charCodeAt(pos) === 41) {
                  result4 = ")";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\")\"");
                  }
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, args) { return args; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_arg() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        result0 = parse_expr();
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = [];
          result1 = parse_ws();
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_ws();
          }
          if (result0 !== null) {
            if (input.charCodeAt(pos) === 44) {
              result1 = ",";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\",\"");
              }
            }
            if (result1 !== null) {
              result2 = [];
              result3 = parse_ws();
              while (result3 !== null) {
                result2.push(result3);
                result3 = parse_ws();
              }
              if (result2 !== null) {
                result3 = parse_expr();
                if (result3 !== null) {
                  result0 = [result0, result1, result2, result3];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, expr) { return expr; })(pos0, result0[3]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_op() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_name();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ws();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ws();
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 42) {
              result2 = "*";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*\"");
              }
            }
            if (result2 === null) {
              if (input.charCodeAt(pos) === 43) {
                result2 = "+";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"+\"");
                }
              }
              if (result2 === null) {
                if (input.charCodeAt(pos) === 47) {
                  result2 = "/";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"/\"");
                  }
                }
              }
            }
            if (result2 !== null) {
              result3 = [];
              result4 = parse_ws();
              while (result4 !== null) {
                result3.push(result4);
                result4 = parse_ws();
              }
              if (result3 !== null) {
                result4 = parse_expr();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, left, sym, right) { return Op.create(left, right, sym); })(pos0, result0[0], result0[2], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_primitive() {
        var result0;
        
        result0 = parse_name();
        if (result0 === null) {
          result0 = parse_str();
          if (result0 === null) {
            result0 = parse_num();
          }
        }
        return result0;
      }
      
      function parse_name() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[a-z]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-z]");
          }
        }
        if (result1 === null) {
          if (/^[A-Z]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[A-Z]");
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-z]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-z]");
              }
            }
            if (result1 === null) {
              if (/^[A-Z]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[A-Z]");
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return new Name(chars.join('')); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_str() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 34) {
          result0 = "\"";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\"\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          if (/^[^"]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[^\"]");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (/^[^"]/.test(input.charAt(pos))) {
              result2 = input.charAt(pos);
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("[^\"]");
              }
            }
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 34) {
              result2 = "\"";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\\"\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return new Str(chars.join('')); })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_num() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[0-9]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[0-9]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[0-9]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, chars) { return new Num(parseFloat(chars.join(''))); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ws() {
        var result0;
        
        if (input.charCodeAt(pos) === 32) {
          result0 = " ";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\" \"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 10) {
            result0 = "\n";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\n\"");
            }
          }
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
        // Import AST types for building the Abstract Syntax Tree.
        var AST = require('./AST.coffee');
        var Program = AST.Program;
        var Data = AST.Data;
        var Source = AST.Source;
        var FnStmt = AST.FnStmt;
        var Scale = AST.Scale;
        var Coord = AST.Coord;
        var Guide = AST.Guide;
        var Element = AST.Element;
        var Fn = AST.Fn;
        var Op = AST.Op;
        var Name = AST.Name;
        var Str = AST.Str;
        var Num = AST.Num;
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();

},{"./AST.coffee":17}],5:[function(require,module,exports){
(function() {
  var compact, extractDataStmts, map, match, processDataStmts, _;

  match = require('./match.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  processDataStmts = function(ast, vars) {
    var dataStmt, dataStmts, newName, oldName, _i, _len;

    dataStmts = extractDataStmts(ast);
    for (_i = 0, _len = dataStmts.length; _i < _len; _i++) {
      dataStmt = dataStmts[_i];
      newName = dataStmt.name;
      oldName = dataStmt.expr.value;
      vars[newName] = vars[oldName];
    }
    return vars;
  };

  extractDataStmts = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return compact(map(stmts, extractDataStmts));
    },
    Data: function(d) {
      return d;
    },
    AST: function() {}
  });

  module.exports = processDataStmts;

}).call(this);


},{"./match.coffee":10,"underscore":15}],6:[function(require,module,exports){
(function() {
  var AST, Element, Fn, Program, Relation, Scale, applyScales, argsToOptions, compact, extractScaleStmts, extractScalesByDim, map, match, processScaleStmts, scaleFactories, type, _;

  match = require('./match.coffee');

  type = require('./type.coffee');

  Relation = require('./Relation.coffee');

  Scale = require('./Scale.coffee');

  AST = require('./AST.coffee');

  Program = AST.Program;

  Element = AST.Element;

  Fn = AST.Fn;

  argsToOptions = require('./argsToOptions.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  processScaleStmts = function(ast) {
    var scales, scalesByDim;

    scalesByDim = extractScalesByDim(ast);
    scales = match({
      Program: function(_arg) {
        var stmts;

        stmts = _arg.stmts;
        return new Program(map(stmts, scales));
      },
      Element: function(_arg) {
        var fn;

        fn = _arg.fn;
        return new Element('ELEMENT', scales(fn));
      },
      Fn: function(_arg) {
        var args, name;

        name = _arg.name, args = _arg.args;
        return new Fn(name, map(args, scales));
      },
      Relation: function(relation) {
        return applyScales(relation, scalesByDim);
      },
      AST: function(ast) {
        return ast;
      }
    });
    return scales(ast);
  };

  extractScalesByDim = function(ast) {
    var dim, fn, makeScale, scaleStmts, scalesByDim, _i, _len;

    scaleStmts = extractScaleStmts(ast);
    scalesByDim = {};
    for (_i = 0, _len = scaleStmts.length; _i < _len; _i++) {
      fn = scaleStmts[_i].fn;
      dim = argsToOptions(fn.args).dim;
      makeScale = scaleFactories[fn.name];
      scalesByDim[dim.value] = makeScale();
    }
    return scalesByDim;
  };

  scaleFactories = {
    linear: function() {
      return new Scale;
    }
  };

  extractScaleStmts = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return compact(map(stmts, extractScaleStmts));
    },
    Scale: function(s) {
      return s;
    },
    AST: function() {}
  });

  applyScales = function(relation, scalesByDim) {
    var attribute, attributes, dim, keys;

    keys = relation.keys;
    attributes = (function() {
      var _i, _ref, _results;

      _results = [];
      for (dim = _i = 1, _ref = relation.attributes.length; 1 <= _ref ? _i <= _ref : _i >= _ref; dim = 1 <= _ref ? ++_i : --_i) {
        attribute = relation.attributes[dim - 1];
        if (scalesByDim[dim]) {
          _results.push(scalesByDim[dim].apply(attribute));
        } else {
          _results.push(attribute);
        }
      }
      return _results;
    })();
    return new Relation(keys, attributes);
  };

  module.exports = processScaleStmts;

}).call(this);


},{"./match.coffee":10,"./type.coffee":16,"./Relation.coffee":18,"./Scale.coffee":11,"./AST.coffee":17,"./argsToOptions.coffee":13,"underscore":15}],7:[function(require,module,exports){
(function() {
  var CoordinateSpace, argsToOptions, compact, coordFactories, extractCoordStmts, map, match, processCoordStmts, _;

  match = require('./match.coffee');

  argsToOptions = require('./argsToOptions.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  processCoordStmts = function(ast) {
    var coordStmts, dim, fn, makeCoordinates;

    coordStmts = extractCoordStmts(ast);
    if (coordStmts.length !== 1) {
      throw Error("Exactly 1 COORD statement expected, got " + coordStmts.length);
    }
    fn = coordStmts[0].fn;
    dim = argsToOptions(fn.args).dim;
    makeCoordinates = coordFactories[fn.name];
    return makeCoordinates(dim);
  };

  extractCoordStmts = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return compact(map(stmts, extractCoordStmts));
    },
    Coord: function(c) {
      return c;
    },
    AST: function() {}
  });

  coordFactories = {
    rect: function(dim) {
      return new CoordinateSpace;
    }
  };

  CoordinateSpace = (function() {
    function CoordinateSpace() {}

    return CoordinateSpace;

  })();

  module.exports = processCoordStmts;

}).call(this);


},{"./match.coffee":10,"./argsToOptions.coffee":13,"underscore":15}],8:[function(require,module,exports){
(function() {
  var AST, Cross, Element, Fn, Program, Relation, compact, evaluateAlgebra, map, match, _;

  match = require('./match.coffee');

  Relation = require('./Relation.coffee');

  AST = require('./AST.coffee');

  Program = AST.Program;

  Element = AST.Element;

  Fn = AST.Fn;

  Cross = AST.Cross;

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  evaluateAlgebra = function(ast, vars) {
    var algebra;

    algebra = match({
      Program: function(_arg) {
        var stmts;

        stmts = _arg.stmts;
        return new Program(map(stmts, algebra));
      },
      Element: function(_arg) {
        var fn;

        fn = _arg.fn;
        return new Element('ELEMENT', algebra(fn));
      },
      Fn: function(_arg) {
        var args, name;

        name = _arg.name, args = _arg.args;
        return new Fn(name, map(args, algebra));
      },
      Cross: function(_arg) {
        var left, right, sym;

        left = _arg.left, right = _arg.right, sym = _arg.sym;
        return Relation.cross(algebra(left), algebra(right));
      },
      Name: function(_arg) {
        var value;

        value = _arg.value;
        return Relation.fromAttribute(vars[value]);
      },
      AST: function(ast) {
        return ast;
      }
    });
    return algebra(ast);
  };

  module.exports = evaluateAlgebra;

}).call(this);


},{"./match.coffee":10,"./Relation.coffee":18,"./AST.coffee":17,"underscore":15}],9:[function(require,module,exports){
(function() {
  var map, match, show;

  match = require('./match.coffee');

  map = (require('underscore')).map;

  show = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return (map(stmts, show)).join('\n');
    },
    Data: function(_arg) {
      var expr, name;

      name = _arg.name, expr = _arg.expr;
      return "DATA: " + name + " = " + (show(expr));
    },
    Source: function(_arg) {
      var csvPath;

      csvPath = _arg.csvPath;
      return "SOURCE: \"" + csvPath + "\"";
    },
    FnStmt: function(_arg) {
      var fn, label;

      label = _arg.label, fn = _arg.fn;
      return "" + label + ": " + (show(fn));
    },
    Primitive: function(_arg) {
      var value;

      value = _arg.value;
      return value;
    },
    Str: function(_arg) {
      var value;

      value = _arg.value;
      return '"' + value + '"';
    },
    Fn: function(_arg) {
      var args, name;

      name = _arg.name, args = _arg.args;
      return "" + name + "(" + ((map(args, show)).join(', ')) + ")";
    },
    Op: function(_arg) {
      var left, right, sym;

      left = _arg.left, right = _arg.right, sym = _arg.sym;
      return "" + (show(left)) + sym + (show(right));
    },
    Relation: function(r) {
      return "\n" + r.toCSV() + "\n";
    }
  });

  module.exports = show;

}).call(this);


},{"./match.coffee":10,"underscore":15}],11:[function(require,module,exports){
(function() {
  var Attribute, Interval, Relation, Scale, max, min, type, _;

  type = require('./type.coffee');

  Relation = require('./Relation.coffee');

  Attribute = Relation.Attribute;

  Interval = require('./Interval.coffee');

  _ = require('underscore');

  min = _.min;

  max = _.max;

  Scale = (function() {
    function Scale() {}

    Scale.prototype.apply = function(attribute) {
      var dest, key, keys, map, name, normalize, src, values, _i, _len;

      type(attribute, Attribute);
      values = attribute.values();
      src = new Interval(min(values), max(values));
      dest = new Interval(0, 1);
      normalize = function(key) {
        return src.to(dest, attribute.map[key]);
      };
      name = attribute.name;
      keys = attribute.keys;
      map = {};
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        map[key] = normalize(key);
      }
      return new Attribute(name, keys, map);
    };

    return Scale;

  })();

  module.exports = Scale;

}).call(this);


},{"./type.coffee":16,"./Relation.coffee":18,"./Interval.coffee":12,"underscore":15}],4:[function(require,module,exports){
(function() {
  var Relation, async, compact, extractSources, getFile, getRelation, getRelations, map, match, processSourceStmts, _;

  match = require('./match.coffee');

  getFile = require('./getFile.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  async = require('async');

  Relation = require('./Relation.coffee');

  processSourceStmts = function(ast, callback) {
    var sources;

    sources = extractSources(ast);
    return getRelations(sources, function(err, relations) {
      var attr, relation, vars, _i, _j, _len, _len1, _ref;

      vars = {};
      for (_i = 0, _len = relations.length; _i < _len; _i++) {
        relation = relations[_i];
        _ref = relation.attributes;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          attr = _ref[_j];
          vars[attr.name] = attr;
        }
      }
      return callback(null, vars);
    });
  };

  extractSources = match({
    Program: function(_arg) {
      var stmts;

      stmts = _arg.stmts;
      return compact(map(stmts, extractSources));
    },
    Source: function(s) {
      return s;
    },
    AST: function() {}
  });

  getRelations = function(sources, callback) {
    return async.map(sources, getRelation, callback);
  };

  getRelation = function(source, callback) {
    return getFile(source.csvPath, function(err, csvText) {
      var relation, table;

      if (err) {
        callback(err);
      }
      table = $.csv.toArrays(csvText);
      relation = Relation.fromTable(table);
      return callback(null, relation);
    });
  };

  module.exports = processSourceStmts;

}).call(this);


},{"./match.coffee":10,"./getFile.coffee":3,"./Relation.coffee":18,"underscore":15,"async":19}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],19:[function(require,module,exports){
(function(process){/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                setImmediate(fn);
            };
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
        }
    }
    else {
        async.nextTick = process.nextTick;
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            var sync = true;
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        if (sync) {
                            async.nextTick(iterate);
                        }
                        else {
                            iterate();
                        }
                    }
                }
            });
            sync = false;
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.nextTick(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.nextTick(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            var sync = true;
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (sync) {
                    async.nextTick(function () {
                        async.whilst(test, iterator, callback);
                    });
                }
                else {
                    async.whilst(test, iterator, callback);
                }
            });
            sync = false;
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var sync = true;
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                if (sync) {
                    async.nextTick(function () {
                        async.doWhilst(iterator, test, callback);
                    });
                }
                else {
                    async.doWhilst(iterator, test, callback);
                }
            }
            else {
                callback();
            }
        });
        sync = false;
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            var sync = true;
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (sync) {
                    async.nextTick(function () {
                        async.until(test, iterator, callback);
                    });
                }
                else {
                    async.until(test, iterator, callback);
                }
            });
            sync = false;
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        var sync = true;
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                if (sync) {
                    async.nextTick(function () {
                        async.doUntil(iterator, test, callback);
                    });
                }
                else {
                    async.doUntil(iterator, test, callback);
                }
            }
            else {
                callback();
            }
        });
        sync = false;
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.nextTick(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var sync = true;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(function () {
                        var cbArgs = arguments;

                        if (sync) {
                            async.nextTick(function () {
                                next.apply(null, cbArgs);
                            });
                        } else {
                            next.apply(null, arguments);
                        }
                    });
                    worker(task.data, cb);
                    sync = false;
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.nextTick(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.applyEach = function (fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return async.each(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

})(require("__browserify_process"))
},{"__browserify_process":20}],16:[function(require,module,exports){
(function() {
  var type;

  type = function(object, expectedType) {
    var c, error, message;

    error = false;
    if (expectedType === Number) {
      error = typeof object !== 'number';
    } else if (expectedType === String) {
      error = typeof object !== 'string';
    } else {
      c = object.constructor;
      error = c !== expectedType;
      while (error && (c != null ? c.__super__ : void 0)) {
        c = c.__super__.constructor;
        error = c !== expectedType;
      }
      if (error) {
        message = "Exped type , got type '" + (typeof object);
      }
    }
    if (error) {
      throw Error('Type Error');
    }
  };

  module.exports = type;

}).call(this);


},{}],18:[function(require,module,exports){
(function() {
  var Attribute, Relation, first, map, rest, type, union, _;

  type = require('./type.coffee');

  _ = require('underscore');

  map = _.map;

  first = _.first;

  rest = _.rest;

  union = _.union;

  Relation = (function() {
    function Relation(keys, attributes) {
      this.keys = keys;
      this.attributes = attributes;
    }

    Relation.prototype.attribute = function(name) {
      return _.findWhere(this.attributes, {
        name: name
      });
    };

    Relation.prototype.n = function() {
      return this.attributes.length;
    };

    Relation.prototype.m = function() {
      return this.keys.length;
    };

    Relation.prototype.toCSV = function() {
      var attr, line, names, tuples,
        _this = this;

      names = ((function() {
        var _i, _len, _ref, _results;

        _ref = this.attributes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          _results.push(attr.name);
        }
        return _results;
      }).call(this)).join(',');
      line = function(key) {
        return ((function() {
          var _i, _len, _ref, _results;

          _ref = this.attributes;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            attr = _ref[_i];
            _results.push(attr.map[key]);
          }
          return _results;
        }).call(_this)).join(',');
      };
      tuples = (map(this.keys, line)).join('\n');
      return names + '\n' + tuples;
    };

    return Relation;

  })();

  Attribute = (function() {
    function Attribute(name, keys, map) {
      this.name = name;
      this.keys = keys;
      this.map = map;
    }

    Attribute.prototype.values = function() {
      var key, _i, _len, _ref, _results;

      _ref = this.keys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(this.map[key]);
      }
      return _results;
    };

    return Attribute;

  })();

  Relation.Attribute = Attribute;

  Relation.fromAttribute = function(attr) {
    return new Relation(attr.keys, [attr]);
  };

  Relation.fromTable = function(table) {
    var attributes, i, key, keyValueMap, keys, m, n, name, names, tuple, tuples, _i, _results;

    names = first(table);
    tuples = rest(table);
    n = names.length;
    m = tuples.length;
    keys = (function() {
      _results = [];
      for (var _i = 0; 0 <= m ? _i < m : _i > m; 0 <= m ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    attributes = (function() {
      var _j, _k, _len, _results1;

      _results1 = [];
      for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
        name = names[i];
        keyValueMap = {};
        for (_k = 0, _len = keys.length; _k < _len; _k++) {
          key = keys[_k];
          tuple = tuples[key];
          keyValueMap[key] = parseFloat(tuple[i]);
        }
        _results1.push(new Attribute(name, keys, keyValueMap));
      }
      return _results1;
    })();
    return new Relation(keys, attributes);
  };

  Relation.cross = function(a, b) {
    var attributes, keys;

    type(a, Relation);
    type(b, Relation);
    keys = a.keys;
    attributes = union(a.attributes, b.attributes);
    return new Relation(keys, attributes);
  };

  module.exports = Relation;

}).call(this);


},{"./type.coffee":16,"underscore":15}],17:[function(require,module,exports){
(function() {
  var AST, Blend, Coord, Cross, Data, Element, Expr, Fn, FnStmt, Guide, Name, Nest, Num, Op, Primitive, Program, Scale, Source, Stmt, Str, type, _, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  type = require('./type.coffee');

  AST = (function() {
    function AST() {}

    return AST;

  })();

  Program = (function(_super) {
    __extends(Program, _super);

    function Program(stmts) {
      this.stmts = stmts;
    }

    return Program;

  })(AST);

  Stmt = (function(_super) {
    __extends(Stmt, _super);

    function Stmt() {
      _ref = Stmt.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Stmt;

  })(AST);

  Source = (function(_super) {
    __extends(Source, _super);

    function Source(csvPath) {
      this.csvPath = csvPath;
      type(this.csvPath, String);
    }

    return Source;

  })(Stmt);

  Data = (function(_super) {
    __extends(Data, _super);

    function Data(name, expr) {
      this.name = name;
      this.expr = expr;
      type(this.name, String);
    }

    return Data;

  })(Stmt);

  FnStmt = (function(_super) {
    __extends(FnStmt, _super);

    function FnStmt(label, fn) {
      this.label = label;
      this.fn = fn;
      type(this.label, String);
      type(this.fn, Fn);
    }

    return FnStmt;

  })(Stmt);

  FnStmt.create = function(label, fn) {
    switch (label) {
      case 'SCALE':
        return new Scale(label, fn);
      case 'COORD':
        return new Coord(label, fn);
      case 'GUIDE':
        return new Guide(label, fn);
      case 'ELEMENT':
        return new Element(label, fn);
    }
  };

  Scale = (function(_super) {
    __extends(Scale, _super);

    function Scale() {
      _ref1 = Scale.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    return Scale;

  })(FnStmt);

  Coord = (function(_super) {
    __extends(Coord, _super);

    function Coord() {
      _ref2 = Coord.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    return Coord;

  })(FnStmt);

  Guide = (function(_super) {
    __extends(Guide, _super);

    function Guide() {
      _ref3 = Guide.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    return Guide;

  })(FnStmt);

  Element = (function(_super) {
    __extends(Element, _super);

    function Element() {
      _ref4 = Element.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    return Element;

  })(FnStmt);

  Expr = (function(_super) {
    __extends(Expr, _super);

    function Expr() {
      _ref5 = Expr.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    return Expr;

  })(AST);

  Fn = (function(_super) {
    __extends(Fn, _super);

    function Fn(name, args) {
      this.name = name;
      this.args = args;
      type(this.name, String);
    }

    return Fn;

  })(Expr);

  Op = (function(_super) {
    __extends(Op, _super);

    function Op(left, right, sym) {
      this.left = left;
      this.right = right;
      this.sym = sym;
      type(this.left, Name);
      type(this.right, Expr);
    }

    return Op;

  })(Expr);

  Op.create = function(left, right, sym) {
    switch (sym) {
      case '*':
        return new Cross(left, right, sym);
      case '+':
        return new Blend(left, right, sym);
      case '/':
        return new Nest(left, right, sym);
    }
  };

  Cross = (function(_super) {
    __extends(Cross, _super);

    function Cross() {
      _ref6 = Cross.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    return Cross;

  })(Op);

  Blend = (function(_super) {
    __extends(Blend, _super);

    function Blend() {
      _ref7 = Blend.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    return Blend;

  })(Op);

  Nest = (function(_super) {
    __extends(Nest, _super);

    function Nest() {
      _ref8 = Nest.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    return Nest;

  })(Op);

  Primitive = (function(_super) {
    __extends(Primitive, _super);

    function Primitive() {
      _ref9 = Primitive.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    return Primitive;

  })(Expr);

  Name = (function(_super) {
    __extends(Name, _super);

    function Name(value) {
      this.value = value;
      type(this.value, String);
    }

    return Name;

  })(Primitive);

  Str = (function(_super) {
    __extends(Str, _super);

    function Str(value) {
      this.value = value;
      type(this.value, String);
    }

    return Str;

  })(Primitive);

  Num = (function(_super) {
    __extends(Num, _super);

    function Num(value) {
      this.value = value;
      type(this.value, Number);
    }

    return Num;

  })(Primitive);

  _.extend(AST, {
    Program: Program,
    Stmt: Stmt,
    Data: Data,
    Source: Source,
    FnStmt: FnStmt,
    Scale: Scale,
    Coord: Coord,
    Guide: Guide,
    Element: Element,
    Expr: Expr,
    Primitive: Primitive,
    Name: Name,
    Str: Str,
    Num: Num,
    Fn: Fn,
    Op: Op,
    Cross: Cross,
    Blend: Blend,
    Nest: Nest
  });

  module.exports = AST;

}).call(this);


},{"./type.coffee":16,"underscore":15}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvZ2V0RmlsZS5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvbWF0Y2guY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL2FyZ3NUb09wdGlvbnMuY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL3Rlc3RzLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9JbnRlcnZhbC5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvcGFyc2VyLmpzIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL3Byb2Nlc3NEYXRhU3RtdHMuY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL3Byb2Nlc3NTY2FsZVN0bXRzLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9wcm9jZXNzQ29vcmRTdG10cy5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvZXZhbHVhdGVBbGdlYnJhLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9zaG93LmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9TY2FsZS5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvcHJvY2Vzc1NvdXJjZVN0bXRzLmNvZmZlZSIsIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9jdXJyYW4vbm9kZV9tb2R1bGVzL2FzeW5jL2xpYi9hc3luYy5qcyIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy90eXBlLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9SZWxhdGlvbi5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvQVNULmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0NBQUEsS0FBQSw2U0FBQTs7Q0FBQSxDQUFBLENBQVEsRUFBUixFQUFRLFNBQUE7O0NBQVIsQ0FDQSxDQUFVLElBQVYsV0FBVTs7Q0FEVixDQUVBLENBQVEsRUFBUixFQUFTLEdBQUE7O0NBRlQsQ0FHQSxDQUFxQixJQUFBLFdBQXJCLFdBQXFCOztDQUhyQixDQUlBLENBQW1CLElBQUEsU0FBbkIsV0FBbUI7O0NBSm5CLENBS0EsQ0FBb0IsSUFBQSxVQUFwQixXQUFvQjs7Q0FMcEIsQ0FNQSxDQUFvQixJQUFBLFVBQXBCLFdBQW9COztDQU5wQixDQU9BLENBQWtCLElBQUEsUUFBbEIsV0FBa0I7O0NBUGxCLENBUUEsQ0FBTyxDQUFQLEdBQU8sUUFBQTs7Q0FSUCxDQVNBLENBQVEsRUFBUixFQUFRLFNBQUE7O0NBVFIsQ0FVQSxDQUFRLEVBQVIsRUFBUSxTQUFBOztDQVZSLENBV0EsQ0FBVyxJQUFBLENBQVgsV0FBVzs7Q0FYWCxDQWFBLENBQUksSUFBQSxLQUFBOztDQWJKLENBY0EsQ0FBQTs7Q0FkQSxDQWVBLENBQVUsSUFBVjs7Q0FmQSxDQWdCQSxDQUFRLEVBQVI7O0NBaEJBLENBaUJBLENBQWdCLElBQUEs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QVIsR0FBQTtDQUpBLEVBT08sQ0FBUCxJQUFBLEVBQXVCO0NBUHZCLEVBUU8sQ0FBUCxDQUFZLEdBQVo7RUFDTSxDQUFOLENBQUEsS0FBQyxNQUFEO0NBQ0UsRUFBQSxXQUFBOztDQUFBLEVBQUEsQ0FBVSxNQUFWO0NBQ0ssQ0FBSyxDQUFBLENBQU4sQ0FBTSxZQUFWO0NBWkosUUFVRTtNQVZGLEVBQUE7RUFhVyxDQUFOLENBQUEsS0FBQyxNQUFEO0NBQUEsZ0JBQWU7Q0FicEIsUUFhSztRQWRBO0NBQVAsSUFBTztDQXpHVCxHQUFBO0NBQUE7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0FBQSxDQUFBO0NBQ0MsRUFBUSxDQUFDLENBQVQsR0FBa0MsS0FBbkM7Q0FQRixJQUlJOztDQUpKOztDQUZGOztDQUFBLENBV0EsQ0FBaUIsR0FBWCxDQUFOLENBWEE7Q0FBQTs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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bmdldEZpbGUgPSByZXF1aXJlICcuL2dldEZpbGUuY29mZmVlJ1xucGFyc2UgPSAocmVxdWlyZSAnLi9wYXJzZXInKS5wYXJzZVxucHJvY2Vzc1NvdXJjZVN0bXRzID0gcmVxdWlyZSAnLi9wcm9jZXNzU291cmNlU3RtdHMuY29mZmVlJ1xucHJvY2Vzc0RhdGFTdG10cyA9IHJlcXVpcmUgJy4vcHJvY2Vzc0RhdGFTdG10cy5jb2ZmZWUnXG5wcm9jZXNzU2NhbGVTdG10cyA9IHJlcXVpcmUgJy4vcHJvY2Vzc1NjYWxlU3RtdHMuY29mZmVlJ1xucHJvY2Vzc0Nvb3JkU3RtdHMgPSByZXF1aXJlICcuL3Byb2Nlc3NDb29yZFN0bXRzLmNvZmZlZSdcbmV2YWx1YXRlQWxnZWJyYSA9IHJlcXVpcmUgJy4vZXZhbHVhdGVBbGdlYnJhLmNvZmZlZSdcbnNob3cgPSByZXF1aXJlICcuL3Nob3cuY29mZmVlJ1xubWF0Y2ggPSByZXF1aXJlICcuL21hdGNoLmNvZmZlZSdcblNjYWxlID0gcmVxdWlyZSAnLi9TY2FsZS5jb2ZmZWUnXG5JbnRlcnZhbCA9IHJlcXVpcmUgJy4vSW50ZXJ2YWwuY29mZmVlJ1xuXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5maXJzdCA9IF8uZmlyc3RcbmFyZ3NUb09wdGlvbnMgPSByZXF1aXJlICcuL2FyZ3NUb09wdGlvbnMuY29mZmVlJ1xuXG4jIFJ1biB1bml0IHRlc3RzIGZvciBwYXJzZXJcbnRlc3RzKClcblxuIyBFdmFsdWF0ZSB0aGUgR3JhbW1hciBvZiBHcmFwaGljcyBleHByZXNzaW9uXG5nZXRGaWxlICdnZy9zY2F0dGVyLmdnJywgKGVyciwgZXhwcikgLT4gZXZhbHVhdGUgZXhwciwgY2FudmFzXG5cbk1hcmsgPSAtPlxuICB4OiAoQF94KSAtPiBAXG4gIHk6IChAX3kpIC0+IEBcbiAgX3NpemU6IDAuMDFcbiAgc2l6ZTogKEBfc2l6ZSkgLT4gQFxuICByZW5kZXI6IChjdHgsIHcsIGgpIC0+XG4gICAgeCA9IEBfeCAqIHdcbiAgICB5ID0gQF95ICogaFxuICAgIHJhZGl1cyA9IEBfc2l6ZSAqICh3ICsgaCkgLyA0XG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmFyYyB4LCB5LCByYWRpdXMsIDAsIDIqTWF0aC5QSVxuICAgIGN0eC5jbG9zZVBhdGgoKVxuICAgIGN0eC5maWxsKClcblxuZXZhbHVhdGUgPSAoZXhwciwgY2FudmFzKSAtPlxuICBhc3QgPSBwYXJzZSBleHByXG4gIHByb2Nlc3NTb3VyY2VTdG10cyBhc3QsIChlcnIsIHZhcnMpIC0+XG4gICAgdmFycyA9IHByb2Nlc3NEYXRhU3RtdHMgYXN0LCB2YXJzXG4gICAgYXN0ID0gZXZhbHVhdGVBbGdlYnJhIGFzdCwgdmFyc1xuICAgIGFzdCA9IHByb2Nlc3NTY2FsZVN0bXRzIGFzdFxuICAgICNjb25zb2xlLmxvZyBzaG93IGFzdFxuICAgIGNvb3JkcyA9IHByb2Nlc3NDb29yZFN0bXRzIGFzdFxuICAgIHJlbmRlckZucyA9IGdlblJlbmRlckZucyBhc3RcbiAgICAjY29uc29sZS5sb2cgcmVuZGVyRm5zXG5cbiAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCAnMmQnXG5cbiAgICBmb3Ige2tleXMsIGdlb21ldHJ5LCBhZXN0aGV0aWNzfSBpbiByZW5kZXJGbnNcbiAgICAgIGZvciBrZXkgaW4ga2V5c1xuICAgICAgICBtYXJrID0gTWFyaygpXG4gICAgICAgIG1hcmsgPSBnZW9tZXRyeSBrZXksIG1hcmtcbiMgICAgICAgIG1hcmsgPSBjb29yZHMuYXBwbHkgbWFya1xuICAgICAgICBtYXJrID0gYWVzdGhldGljcyBrZXksIG1hcmtcbiMgICAgICAgIGNvbnNvbGUubG9nIG1hcmsuX3gsIG1hcmsuX3lcbiAgICAgICAgbWFyay5yZW5kZXIgY3R4LCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHRcblxuZ2VuUmVuZGVyRm5zID0gKGFzdCkgLT5cbiAgZWxlbWVudFN0bXRzID0gZXh0cmFjdEVsZW1lbnRTdG10cyBhc3RcbiAgbWFwIGVsZW1lbnRTdG10cywgKHtmbn0pIC0+XG4gICAgb3B0aW9ucyA9IGFyZ3NUb09wdGlvbnMgZm4uYXJnc1xuICAgIGtleXM6IGV4dHJhY3RLZXlzIGZuXG4gICAgZ2VvbWV0cnk6IGdlbkdlb21ldHJ5Rm4gZm4ubmFtZSwgb3B0aW9uc1xuICAgIGFlc3RoZXRpY3M6IGdlbkFlc3RoZXRpY3NGbiBmbi5uYW1lLCBvcHRpb25zXG5cbmV4dHJhY3RLZXlzID0gbWF0Y2hcbiAgRm46ICh7bmFtZSwgYXJnc30pIC0+XG4gICAgZmlyc3QgbWFwIGFyZ3MsIGV4dHJhY3RLZXlzXG4gIFJlbGF0aW9uOiAocmVsYXRpb24pIC0+IHJlbGF0aW9uLmtleXNcbiAgQVNUOiAtPlxuXG5leHRyYWN0RWxlbWVudFN0bXRzID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+XG4gICAgY29tcGFjdCBtYXAgc3RtdHMsIGV4dHJhY3RFbGVtZW50U3RtdHNcbiAgRWxlbWVudDogKGUpIC0+IGVcbiAgQVNUOiAtPlxuXG5nZW5HZW9tZXRyeUZuID0gKGZuTmFtZSwgb3B0aW9ucykgLT5cbiAgZ2VvbWV0cnlGbnNbZm5OYW1lXSBvcHRpb25zXG5cbmdlb21ldHJ5Rm5zID1cbiAgcG9pbnQ6IChvcHRpb25zKSAtPlxuICAgIGlmIG9wdGlvbnMucG9zaXRpb25cbiAgICAgIHJlbGF0aW9uID0gb3B0aW9ucy5wb3NpdGlvblxuICAgICAgYXR0cnMgPSByZWxhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAoa2V5LCBtYXJrKSAtPlxuICAgICAgICBpZiBhdHRycy5sZW5ndGggPT0gMVxuICAgICAgICAgIG1hcmsueChyZWxhdGlvbi5hdHRyaWJ1dGVzWzBdLm1hcFtrZXldKVxuICAgICAgICAgICAgICAueSgwLjUpXG4gICAgICAgIGVsc2UgaWYgYXR0cnMubGVuZ3RoID09IDJcbiAgICAgICAgICBtYXJrLngocmVsYXRpb24uYXR0cmlidXRlc1swXS5tYXBba2V5XSlcbiAgICAgICAgICAgICAgLnkocmVsYXRpb24uYXR0cmlidXRlc1sxXS5tYXBba2V5XSlcbiAgICBlbHNlIChrZXksIG1hcmspIC0+IG1hcmtcblxuZ2VuQWVzdGhldGljc0ZuID0gKGZuTmFtZSwgb3B0aW9ucykgLT5cbiAgYWVzdGhldGljc0Zuc1tmbk5hbWVdIG9wdGlvbnNcblxuXG5hZXN0aGV0aWNzRm5zID1cbiAgcG9pbnQ6ICh7c2l6ZX0pIC0+XG4gICAgaWYgc2l6ZVxuICAgICAgbWluU2l6ZSA9IDAuMDFcbiAgICAgIG1heFNpemUgPSAwLjA1XG4gICAgICB1bml0ID0gbmV3IEludGVydmFsIDAsIDFcbiAgICAgIHNpemVzID0gbmV3IEludGVydmFsIG1pblNpemUsIG1heFNpemVcbiAgICAgIHNjYWxlID0gbmV3IFNjYWxlXG4jICAgICAgc2NhbGUuZGVzdC5taW4gPSAwLjFcbiMgICAgICBzY2FsZS5kZXN0Lm1heCA9IDAuMVxuICAgICAgYXR0ciA9IHNpemUuYXR0cmlidXRlc1swXVxuICAgICAgYXR0ciA9IHNjYWxlLmFwcGx5IGF0dHJcbiAgICAgIChrZXksIG1hcmspIC0+XG4gICAgICAgIHZhbCA9IGF0dHIubWFwW2tleV1cbiAgICAgICAgbWFyay5zaXplIHVuaXQudG8gc2l6ZXMsIHZhbFxuICAgIGVsc2UgKGtleSwgbWFyaykgLT4gbWFya1xuXG4iLCIoZnVuY3Rpb24oKXsvLyAgICAgVW5kZXJzY29yZS5qcyAxLjQuNFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgSW5jLlxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZ2xvYmFsYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXIgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjQuNCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfLmhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRvciB0byBlYWNoIGVsZW1lbnQuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBtYXBgIGlmIGF2YWlsYWJsZS5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVNYXAgJiYgb2JqLm1hcCA9PT0gbmF0aXZlTWFwKSByZXR1cm4gb2JqLm1hcChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmVzdWx0c1tyZXN1bHRzLmxlbmd0aF0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgdmFyIHJlZHVjZUVycm9yID0gJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnO1xuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZWAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZSAmJiBvYmoucmVkdWNlID09PSBuYXRpdmVSZWR1Y2UpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZShpdGVyYXRvcik7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gdmFsdWU7XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlUmlnaHRgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2VSaWdodCAmJiBvYmoucmVkdWNlUmlnaHQgPT09IG5hdGl2ZVJlZHVjZVJpZ2h0KSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IsIG1lbW8pIDogb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCAhPT0gK2xlbmd0aCkge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpbmRleCA9IGtleXMgPyBrZXlzWy0tbGVuZ3RoXSA6IC0tbGVuZ3RoO1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSBvYmpbaW5kZXhdO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIG9ialtpbmRleF0sIGluZGV4LCBsaXN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWluaXRpYWwpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlRmlsdGVyICYmIG9iai5maWx0ZXIgPT09IG5hdGl2ZUZpbHRlcikgcmV0dXJuIG9iai5maWx0ZXIoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4gIWl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBzb21lYCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIHZhciBhbnkgPSBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVTb21lICYmIG9iai5zb21lID09PSBuYXRpdmVTb21lKSByZXR1cm4gb2JqLnNvbWUoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gdmFsdWVba2V5XTsgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycywgZmlyc3QpIHtcbiAgICBpZiAoXy5pc0VtcHR5KGF0dHJzKSkgcmV0dXJuIGZpcnN0ID8gbnVsbCA6IFtdO1xuICAgIHJldHVybiBfW2ZpcnN0ID8gJ2ZpbmQnIDogJ2ZpbHRlciddKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gdmFsdWVba2V5XSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy53aGVyZShvYmosIGF0dHJzLCB0cnVlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCBvciAoZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIC8vIENhbid0IG9wdGltaXplIGFycmF5cyBvZiBpbnRlZ2VycyBsb25nZXIgdGhhbiA2NSw1MzUgZWxlbWVudHMuXG4gIC8vIFNlZTogaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTgwNzk3XG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiAtSW5maW5pdHk7XG4gICAgdmFyIHJlc3VsdCA9IHtjb21wdXRlZCA6IC1JbmZpbml0eSwgdmFsdWU6IC1JbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkID49IHJlc3VsdC5jb21wdXRlZCAmJiAocmVzdWx0ID0ge3ZhbHVlIDogdmFsdWUsIGNvbXB1dGVkIDogY29tcHV0ZWR9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzRW1wdHkob2JqKSkgcmV0dXJuIEluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiBJbmZpbml0eSwgdmFsdWU6IEluZmluaXR5fTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgY29tcHV0ZWQgPCByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGFuIGFycmF5LlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgbG9va3VwIGl0ZXJhdG9ycy5cbiAgdmFyIGxvb2t1cEl0ZXJhdG9yID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlIDogZnVuY3Rpb24ob2JqKXsgcmV0dXJuIG9ialt2YWx1ZV07IH07XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdG9yLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlIDogdmFsdWUsXG4gICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhIDogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggPCByaWdodC5pbmRleCA/IC0xIDogMTtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0LCBiZWhhdmlvcikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcih2YWx1ZSB8fCBfLmlkZW50aXR5KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICB2YXIga2V5ID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBncm91cChvYmosIHZhbHVlLCBjb250ZXh0LCBmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICAgIChfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSA6IChyZXN1bHRba2V5XSA9IFtdKSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSA9IDA7XG4gICAgICByZXN1bHRba2V5XSsrO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yID09IG51bGwgPyBfLmlkZW50aXR5IDogbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjb252ZXJ0IGFueXRoaW5nIGl0ZXJhYmxlIGludG8gYSByZWFsLCBsaXZlIGFycmF5LlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHJldHVybiAobiAhPSBudWxsKSAmJiAhZ3VhcmQgPyBzbGljZS5jYWxsKGFycmF5LCAwLCBuKSA6IGFycmF5WzBdO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuICE9IG51bGwpICYmICFndWFyZCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb21wbGV0ZWx5IGZsYXR0ZW5lZCB2ZXJzaW9uIG9mIGFuIGFycmF5LlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBbXSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmluZGV4T2Yob3RoZXIsIGl0ZW0pID49IDA7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTsgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoXy5wbHVjayhhcmdzLCAnbGVuZ3RoJykpO1xuICAgIHZhciByZXN1bHRzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJncywgXCJcIiArIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgICAgaSA9IChpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbikge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQgJiYgbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYWxsIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdFxuICAvLyBhbGwgY2FsbGJhY2tzIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIGZ1bmNzID0gXy5mdW5jdGlvbnMob2JqKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHRpbWVvdXQsIHJlc3VsdDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBuZXcgRGF0ZTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIHJlc3VsdDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgcmFuID0gZmFsc2UsIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHJhbikgcmV0dXJuIG1lbW87XG4gICAgICByYW4gPSB0cnVlO1xuICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbZnVuY107XG4gICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICBpZiAodGltZXMgPD0gMCkgcmV0dXJuIGZ1bmMoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IG5hdGl2ZUtleXMgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gT2JqZWN0KG9iaikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHZhbHVlcy5wdXNoKG9ialtrZXldKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHBhaXJzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcGFpcnMucHVzaChba2V5LCBvYmpba2V5XV0pO1xuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJlc3VsdFtvYmpba2V5XV0gPSBrZXk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBudWxsKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIEhhcm1vbnkgYGVnYWxgIHByb3Bvc2FsOiBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gYSA9PSBTdHJpbmcoYik7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLiBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yXG4gICAgICAgIC8vIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYSAhPSArYSA/IGIgIT0gK2IgOiAoYSA9PSAwID8gMSAvIGEgPT0gMSAvIGIgOiBhID09ICtiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PSArYjtcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyIHNvdXJjZSBwYXR0ZXJucyBhbmQgZmxhZ3MuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgICByZXR1cm4gYS5zb3VyY2UgPT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgICAgIGEuZ2xvYmFsID09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICAgICBhLm11bHRpbGluZSA9PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09IGIuaWdub3JlQ2FzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09IGI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIChiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYSkge1xuICAgICAgICBpZiAoXy5oYXMoYSwga2V5KSkge1xuICAgICAgICAgIC8vIENvdW50IHRoZSBleHBlY3RlZCBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICBzaXplKys7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyLlxuICAgICAgICAgIGlmICghKHJlc3VsdCA9IF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgZm9yIChrZXkgaW4gYikge1xuICAgICAgICAgIGlmIChfLmhhcyhiLCBrZXkpICYmICEoc2l6ZS0tKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gIXNpemU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiLCBbXSwgW10pO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAuXG4gIGVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuICEhKG9iaiAmJiBfLmhhcyhvYmosICdjYWxsZWUnKSk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS5cbiAgaWYgKHR5cGVvZiAoLy4vKSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0b3JzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KG4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OycsXG4gICAgICAnLyc6ICcmI3gyRjsnXG4gICAgfVxuICB9O1xuICBlbnRpdHlNYXAudW5lc2NhcGUgPSBfLmludmVydChlbnRpdHlNYXAuZXNjYXBlKTtcblxuICAvLyBSZWdleGVzIGNvbnRhaW5pbmcgdGhlIGtleXMgYW5kIHZhbHVlcyBsaXN0ZWQgaW1tZWRpYXRlbHkgYWJvdmUuXG4gIHZhciBlbnRpdHlSZWdleGVzID0ge1xuICAgIGVzY2FwZTogICBuZXcgUmVnRXhwKCdbJyArIF8ua2V5cyhlbnRpdHlNYXAuZXNjYXBlKS5qb2luKCcnKSArICddJywgJ2cnKSxcbiAgICB1bmVzY2FwZTogbmV3IFJlZ0V4cCgnKCcgKyBfLmtleXMoZW50aXR5TWFwLnVuZXNjYXBlKS5qb2luKCd8JykgKyAnKScsICdnJylcbiAgfTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIF8uZWFjaChbJ2VzY2FwZScsICd1bmVzY2FwZSddLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICBfW21ldGhvZF0gPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIGlmIChzdHJpbmcgPT0gbnVsbCkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuICgnJyArIHN0cmluZykucmVwbGFjZShlbnRpdHlSZWdleGVzW21ldGhvZF0sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiBlbnRpdHlNYXBbbWV0aG9kXVttYXRjaF07XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIHByb3BlcnR5IGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQ7XG4gIC8vIG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbn0pLmNhbGwodGhpcyk7XG5cbn0pKCkiLCIjIGNhbGxiYWNrKGVyciwgdGV4dClcbmdldEZpbGUgPSAocGF0aCwgY2FsbGJhY2spIC0+XG4gICMgVE9ETyBoYW5kbGUgZXJyb3IgY2FzZSBmb3IgbWlzc2luZyBmaWxlc1xuICAkLmdldCBwYXRoLCAodGV4dCkgLT4gY2FsbGJhY2sgbnVsbCwgdGV4dFxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEZpbGVcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZucykgLT5cbiAgKG9iaikgLT5cbiAgICBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvclxuICAgIGZuID0gZm5zW2NvbnN0cnVjdG9yLm5hbWVdXG4gICAgd2hpbGUgIWZuIGFuZCBjb25zdHJ1Y3Rvci5fX3N1cGVyX19cbiAgICAgIGNvbnN0cnVjdG9yID0gY29uc3RydWN0b3IuX19zdXBlcl9fLmNvbnN0cnVjdG9yXG4gICAgICBmbiA9IGZuc1tjb25zdHJ1Y3Rvci5uYW1lXVxuICAgIGlmIGZuXG4gICAgICBmbi5hcHBseSBALCBhcmd1bWVudHNcbiAgICBlbHNlXG4gICAgICB0aHJvdyBFcnJvciBcIm5vIG1hdGNoIGZvciB0eXBlICN7Y29uc3RydWN0b3IubmFtZX0uXCJcbiIsImFyZ3NUb09wdGlvbnMgPSAoYXJncykgLT5cbiAgb3B0aW9ucyA9IHt9XG4gIGZvciBmbiBpbiBhcmdzXG4gICAgIyAgICB0eXBlIGZuLCBGblxuICAgIGlmIGZuLmFyZ3MubGVuZ3RoID09IDFcbiAgICAgIG9wdGlvbnNbZm4ubmFtZV0gPSBmbi5hcmdzWzBdXG4gICAgZWxzZVxuICAgICAgb3B0aW9uc1tmbi5uYW1lXSA9IGZuLmFyZ3NcbiAgcmV0dXJuIG9wdGlvbnNcblxubW9kdWxlLmV4cG9ydHMgPSBhcmdzVG9PcHRpb25zXG4iLCIjIFRlc3RzIGZvciB0aGUgcGFyc2VyXG5wYXJzZSA9IChyZXF1aXJlICcuL3BhcnNlci5qcycpLnBhcnNlXG5zaG93ID0gcmVxdWlyZSAnLi9zaG93LmNvZmZlZSdcblxudGVzdHMgPSAtPlxuICBjaGVjayAnREFUQTogeCA9IHknXG4gIGNoZWNrIFwiXCJcIlxuICAgIERBVEE6IHggPSB5XG4gICAgREFUQTogcSA9IHpcbiAgXCJcIlwiXG4gIGNoZWNrICdEQVRBOiB4ID0gXCJzZXBhbCBsZW5ndGhcIidcbiAgY2hlY2sgJ1NPVVJDRTogXCJkYXRhL2lyaXMuY3N2XCInXG4gIGNoZWNrICdFTEVNRU5UOiBwb2ludChwb3NpdGlvbih4KnkpKSdcbiAgY2hlY2sgJ0VMRU1FTlQ6IHBvaW50KHBvc2l0aW9uKHgreSkpJ1xuICBjaGVjayAnRUxFTUVOVDogcG9pbnQocG9zaXRpb24oeC95KSknXG4gIGNoZWNrIFwiXCJcIlxuICAgIFNPVVJDRTogXCJkYXRhL2lyaXMuY3N2XCJcbiAgICBEQVRBOiB4ID0gXCJwZXRhbCBsZW5ndGhcIlxuICAgIERBVEE6IHkgPSBcInNlcGFsIGxlbmd0aFwiXG4gICAgU0NBTEU6IGxpbmVhcihkaW0oMSkpXG4gICAgU0NBTEU6IGxpbmVhcihkaW0oMikpXG4gICAgQ09PUkQ6IHJlY3QoZGltKDEsIDIpKVxuICAgIEdVSURFOiBheGlzKGRpbSgxKSlcbiAgICBHVUlERTogYXhpcyhkaW0oMikpXG4gICAgRUxFTUVOVDogcG9pbnQocG9zaXRpb24oeCp5KSlcbiAgXCJcIlwiXG4gIGNvbnNvbGUubG9nICdBbGwgdGVzdHMgcGFzc2VkISdcblxuY2hlY2sgPSAoZXhwcikgLT4gYXNzZXJ0RXEgKHNob3cgcGFyc2UgZXhwciksIGV4cHJcblxuYXNzZXJ0RXEgPSAoYWN0dWFsLCBleHBlY3RlZCkgLT4gaWYgYWN0dWFsICE9IGV4cGVjdGVkXG4gIHRocm93IG5ldyBFcnJvciBcIkV4cGVjdGVkICcje2V4cGVjdGVkfScsIGdvdCAnI3thY3R1YWx9J1wiXG5cbm1vZHVsZS5leHBvcnRzID0gdGVzdHNcbiIsInR5cGUgPSByZXF1aXJlICcuL3R5cGUuY29mZmVlJ1xuY2xhc3MgSW50ZXJ2YWxcbiAgY29uc3RydWN0b3I6IChAbWluLCBAbWF4KSAtPlxuICAgIHR5cGUgQG1pbiwgTnVtYmVyXG4gICAgdHlwZSBAbWF4LCBOdW1iZXJcbiAgc3BhbjogLT4gQG1heCAtIEBtaW5cbiAgdG86IChpbnRlcnZhbCwgdmFsdWUpIC0+XG4gICAgdHlwZSBpbnRlcnZhbCwgSW50ZXJ2YWxcbiAgICB0eXBlIHZhbHVlLCBOdW1iZXJcbiAgICAodmFsdWUgLSBAbWluKSAvIEBzcGFuKCkgKiBpbnRlcnZhbC5zcGFuKCkgKyBpbnRlcnZhbC5taW5cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbFxuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKXtcbiAgLypcbiAgICogR2VuZXJhdGVkIGJ5IFBFRy5qcyAwLjcuMC5cbiAgICpcbiAgICogaHR0cDovL3BlZ2pzLm1hamRhLmN6L1xuICAgKi9cbiAgXG4gIGZ1bmN0aW9uIHF1b3RlKHMpIHtcbiAgICAvKlxuICAgICAqIEVDTUEtMjYyLCA1dGggZWQuLCA3LjguNDogQWxsIGNoYXJhY3RlcnMgbWF5IGFwcGVhciBsaXRlcmFsbHkgaW4gYVxuICAgICAqIHN0cmluZyBsaXRlcmFsIGV4Y2VwdCBmb3IgdGhlIGNsb3NpbmcgcXVvdGUgY2hhcmFjdGVyLCBiYWNrc2xhc2gsXG4gICAgICogY2FycmlhZ2UgcmV0dXJuLCBsaW5lIHNlcGFyYXRvciwgcGFyYWdyYXBoIHNlcGFyYXRvciwgYW5kIGxpbmUgZmVlZC5cbiAgICAgKiBBbnkgY2hhcmFjdGVyIG1heSBhcHBlYXIgaW4gdGhlIGZvcm0gb2YgYW4gZXNjYXBlIHNlcXVlbmNlLlxuICAgICAqXG4gICAgICogRm9yIHBvcnRhYmlsaXR5LCB3ZSBhbHNvIGVzY2FwZSBlc2NhcGUgYWxsIGNvbnRyb2wgYW5kIG5vbi1BU0NJSVxuICAgICAqIGNoYXJhY3RlcnMuIE5vdGUgdGhhdCBcIlxcMFwiIGFuZCBcIlxcdlwiIGVzY2FwZSBzZXF1ZW5jZXMgYXJlIG5vdCB1c2VkXG4gICAgICogYmVjYXVzZSBKU0hpbnQgZG9lcyBub3QgbGlrZSB0aGUgZmlyc3QgYW5kIElFIHRoZSBzZWNvbmQuXG4gICAgICovXG4gICAgIHJldHVybiAnXCInICsgc1xuICAgICAgLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykgIC8vIGJhY2tzbGFzaFxuICAgICAgLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSAgICAvLyBjbG9zaW5nIHF1b3RlIGNoYXJhY3RlclxuICAgICAgLnJlcGxhY2UoL1xceDA4L2csICdcXFxcYicpIC8vIGJhY2tzcGFjZVxuICAgICAgLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKSAgIC8vIGhvcml6b250YWwgdGFiXG4gICAgICAucmVwbGFjZSgvXFxuL2csICdcXFxcbicpICAgLy8gbGluZSBmZWVkXG4gICAgICAucmVwbGFjZSgvXFxmL2csICdcXFxcZicpICAgLy8gZm9ybSBmZWVkXG4gICAgICAucmVwbGFjZSgvXFxyL2csICdcXFxccicpICAgLy8gY2FycmlhZ2UgcmV0dXJuXG4gICAgICAucmVwbGFjZSgvW1xceDAwLVxceDA3XFx4MEJcXHgwRS1cXHgxRlxceDgwLVxcdUZGRkZdL2csIGVzY2FwZSlcbiAgICAgICsgJ1wiJztcbiAgfVxuICBcbiAgdmFyIHJlc3VsdCA9IHtcbiAgICAvKlxuICAgICAqIFBhcnNlcyB0aGUgaW5wdXQgd2l0aCBhIGdlbmVyYXRlZCBwYXJzZXIuIElmIHRoZSBwYXJzaW5nIGlzIHN1Y2Nlc3NmdWxsLFxuICAgICAqIHJldHVybnMgYSB2YWx1ZSBleHBsaWNpdGx5IG9yIGltcGxpY2l0bHkgc3BlY2lmaWVkIGJ5IHRoZSBncmFtbWFyIGZyb21cbiAgICAgKiB3aGljaCB0aGUgcGFyc2VyIHdhcyBnZW5lcmF0ZWQgKHNlZSB8UEVHLmJ1aWxkUGFyc2VyfCkuIElmIHRoZSBwYXJzaW5nIGlzXG4gICAgICogdW5zdWNjZXNzZnVsLCB0aHJvd3MgfFBFRy5wYXJzZXIuU3ludGF4RXJyb3J8IGRlc2NyaWJpbmcgdGhlIGVycm9yLlxuICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbihpbnB1dCwgc3RhcnRSdWxlKSB7XG4gICAgICB2YXIgcGFyc2VGdW5jdGlvbnMgPSB7XG4gICAgICAgIFwic3RhcnRcIjogcGFyc2Vfc3RhcnQsXG4gICAgICAgIFwic3RtdFwiOiBwYXJzZV9zdG10LFxuICAgICAgICBcImRhdGFcIjogcGFyc2VfZGF0YSxcbiAgICAgICAgXCJzb3VyY2VcIjogcGFyc2Vfc291cmNlLFxuICAgICAgICBcImZuU3RtdFwiOiBwYXJzZV9mblN0bXQsXG4gICAgICAgIFwiZXhwclwiOiBwYXJzZV9leHByLFxuICAgICAgICBcImZuXCI6IHBhcnNlX2ZuLFxuICAgICAgICBcImFyZ3NcIjogcGFyc2VfYXJncyxcbiAgICAgICAgXCJhcmdcIjogcGFyc2VfYXJnLFxuICAgICAgICBcIm9wXCI6IHBhcnNlX29wLFxuICAgICAgICBcInByaW1pdGl2ZVwiOiBwYXJzZV9wcmltaXRpdmUsXG4gICAgICAgIFwibmFtZVwiOiBwYXJzZV9uYW1lLFxuICAgICAgICBcInN0clwiOiBwYXJzZV9zdHIsXG4gICAgICAgIFwibnVtXCI6IHBhcnNlX251bSxcbiAgICAgICAgXCJ3c1wiOiBwYXJzZV93c1xuICAgICAgfTtcbiAgICAgIFxuICAgICAgaWYgKHN0YXJ0UnVsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChwYXJzZUZ1bmN0aW9uc1tzdGFydFJ1bGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHJ1bGUgbmFtZTogXCIgKyBxdW90ZShzdGFydFJ1bGUpICsgXCIuXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydFJ1bGUgPSBcInN0YXJ0XCI7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgdmFyIHJlcG9ydEZhaWx1cmVzID0gMDtcbiAgICAgIHZhciByaWdodG1vc3RGYWlsdXJlc1BvcyA9IDA7XG4gICAgICB2YXIgcmlnaHRtb3N0RmFpbHVyZXNFeHBlY3RlZCA9IFtdO1xuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYWRMZWZ0KGlucHV0LCBwYWRkaW5nLCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGlucHV0O1xuICAgICAgICBcbiAgICAgICAgdmFyIHBhZExlbmd0aCA9IGxlbmd0aCAtIGlucHV0Lmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWRMZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlc3VsdCA9IHBhZGRpbmcgKyByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGVzY2FwZShjaCkge1xuICAgICAgICB2YXIgY2hhckNvZGUgPSBjaC5jaGFyQ29kZUF0KDApO1xuICAgICAgICB2YXIgZXNjYXBlQ2hhcjtcbiAgICAgICAgdmFyIGxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmIChjaGFyQ29kZSA8PSAweEZGKSB7XG4gICAgICAgICAgZXNjYXBlQ2hhciA9ICd4JztcbiAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVzY2FwZUNoYXIgPSAndSc7XG4gICAgICAgICAgbGVuZ3RoID0gNDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZUNoYXIgKyBwYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpLCAnMCcsIGxlbmd0aCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIG1hdGNoRmFpbGVkKGZhaWx1cmUpIHtcbiAgICAgICAgaWYgKHBvcyA8IHJpZ2h0bW9zdEZhaWx1cmVzUG9zKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAocG9zID4gcmlnaHRtb3N0RmFpbHVyZXNQb3MpIHtcbiAgICAgICAgICByaWdodG1vc3RGYWlsdXJlc1BvcyA9IHBvcztcbiAgICAgICAgICByaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkID0gW107XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzRXhwZWN0ZWQucHVzaChmYWlsdXJlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2Vfc3RhcnQoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxO1xuICAgICAgICB2YXIgcG9zMDtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIHJlc3VsdDEgPSBwYXJzZV9zdG10KCk7XG4gICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwLnB1c2gocmVzdWx0MSk7XG4gICAgICAgICAgICByZXN1bHQxID0gcGFyc2Vfc3RtdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBzdG10cykgeyByZXR1cm4gbmV3IFByb2dyYW0oc3RtdHMpOyB9KShwb3MwLCByZXN1bHQwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX3N0bXQoKSB7XG4gICAgICAgIHZhciByZXN1bHQwO1xuICAgICAgICBcbiAgICAgICAgcmVzdWx0MCA9IHBhcnNlX2RhdGEoKTtcbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gcGFyc2Vfc291cmNlKCk7XG4gICAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBwYXJzZV9mblN0bXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX2RhdGEoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzLCByZXN1bHQ0LCByZXN1bHQ1LCByZXN1bHQ2LCByZXN1bHQ3LCByZXN1bHQ4O1xuICAgICAgICB2YXIgcG9zMCwgcG9zMTtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIHBvczEgPSBwb3M7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA1KSA9PT0gXCJEQVRBOlwiKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFwiREFUQTpcIjtcbiAgICAgICAgICBwb3MgKz0gNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIkRBVEE6XFxcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQxID0gW107XG4gICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDEucHVzaChyZXN1bHQyKTtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBwYXJzZV93cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX25hbWUoKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDMgPSBbXTtcbiAgICAgICAgICAgICAgcmVzdWx0NCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIHdoaWxlIChyZXN1bHQ0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0My5wdXNoKHJlc3VsdDQpO1xuICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNjEpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBcIj1cIjtcbiAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQ0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCI9XFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDUgPSBbXTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDYgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDYgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0NS5wdXNoKHJlc3VsdDYpO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQ2ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQ1ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDYgPSBwYXJzZV9uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQ2ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0NiA9IHBhcnNlX3N0cigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQ2ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0NyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDggPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChyZXN1bHQ4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ3LnB1c2gocmVzdWx0OCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ4ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdDcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NCwgcmVzdWx0NSwgcmVzdWx0NiwgcmVzdWx0N107XG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBsZWZ0LCBleHByKSB7IHJldHVybiBuZXcgRGF0YShsZWZ0LnZhbHVlLCBleHByKTsgfSkocG9zMCwgcmVzdWx0MFsyXSwgcmVzdWx0MFs2XSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9zb3VyY2UoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzLCByZXN1bHQ0O1xuICAgICAgICB2YXIgcG9zMCwgcG9zMTtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIHBvczEgPSBwb3M7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA3KSA9PT0gXCJTT1VSQ0U6XCIpIHtcbiAgICAgICAgICByZXN1bHQwID0gXCJTT1VSQ0U6XCI7XG4gICAgICAgICAgcG9zICs9IDc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJTT1VSQ0U6XFxcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQxID0gW107XG4gICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDEucHVzaChyZXN1bHQyKTtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBwYXJzZV93cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3N0cigpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IFtdO1xuICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQzLnB1c2gocmVzdWx0NCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0NCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gW3Jlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDNdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gKGZ1bmN0aW9uKG9mZnNldCwgY3N2UGF0aCkgeyByZXR1cm4gbmV3IFNvdXJjZShjc3ZQYXRoLnZhbHVlKTsgfSkocG9zMCwgcmVzdWx0MFsyXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9mblN0bXQoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzLCByZXN1bHQ0LCByZXN1bHQ1O1xuICAgICAgICB2YXIgcG9zMCwgcG9zMTtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIHBvczEgPSBwb3M7XG4gICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA1KSA9PT0gXCJTQ0FMRVwiKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFwiU0NBTEVcIjtcbiAgICAgICAgICBwb3MgKz0gNTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIlNDQUxFXFxcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBvcywgNSkgPT09IFwiQ09PUkRcIikge1xuICAgICAgICAgICAgcmVzdWx0MCA9IFwiQ09PUkRcIjtcbiAgICAgICAgICAgIHBvcyArPSA1O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJDT09SRFxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuc3Vic3RyKHBvcywgNSkgPT09IFwiR1VJREVcIikge1xuICAgICAgICAgICAgICByZXN1bHQwID0gXCJHVUlERVwiO1xuICAgICAgICAgICAgICBwb3MgKz0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJHVUlERVxcXCJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA3KSA9PT0gXCJFTEVNRU5UXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gXCJFTEVNRU5UXCI7XG4gICAgICAgICAgICAgICAgcG9zICs9IDc7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJFTEVNRU5UXFxcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA1OCkge1xuICAgICAgICAgICAgcmVzdWx0MSA9IFwiOlwiO1xuICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIjpcXFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MiA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICB3aGlsZSAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQyLnB1c2gocmVzdWx0Myk7XG4gICAgICAgICAgICAgIHJlc3VsdDMgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX2ZuKCk7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0NCA9IFtdO1xuICAgICAgICAgICAgICAgIHJlc3VsdDUgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChyZXN1bHQ1ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQ0LnB1c2gocmVzdWx0NSk7XG4gICAgICAgICAgICAgICAgICByZXN1bHQ1ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBsYWJlbCwgZm4pIHsgcmV0dXJuIEZuU3RtdC5jcmVhdGUobGFiZWwsIGZuKTsgfSkocG9zMCwgcmVzdWx0MFswXSwgcmVzdWx0MFszXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9leHByKCkge1xuICAgICAgICB2YXIgcmVzdWx0MDtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdDAgPSBwYXJzZV9mbigpO1xuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBwYXJzZV9vcCgpO1xuICAgICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwID0gcGFyc2VfcHJpbWl0aXZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9mbigpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDE7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKC9eW2Etel0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgIHBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbYS16XVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDEgPT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0Nikge1xuICAgICAgICAgICAgcmVzdWx0MSA9IFwiLlwiO1xuICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIi5cXFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBbXTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MC5wdXNoKHJlc3VsdDEpO1xuICAgICAgICAgICAgaWYgKC9eW2Etel0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbYS16XVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNDYpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQxID0gXCIuXCI7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIuXFxcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQxID0gcGFyc2VfYXJncygpO1xuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwID0gW3Jlc3VsdDAsIHJlc3VsdDFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gKGZ1bmN0aW9uKG9mZnNldCwgbmFtZSwgYXJncykgeyByZXR1cm4gbmV3IEZuKG5hbWUuam9pbignJyksIGFyZ3MpO30pKHBvczAsIHJlc3VsdDBbMF0sIHJlc3VsdDBbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2VfYXJncygpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDQ7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNDApIHtcbiAgICAgICAgICByZXN1bHQwID0gXCIoXCI7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIoXFxcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQxID0gW107XG4gICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDEucHVzaChyZXN1bHQyKTtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBwYXJzZV93cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MiA9IFtdO1xuICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX2FyZygpO1xuICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzdWx0Mi5wdXNoKHJlc3VsdDMpO1xuICAgICAgICAgICAgICByZXN1bHQzID0gcGFyc2VfYXJnKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQzID0gW107XG4gICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0NCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDMucHVzaChyZXN1bHQ0KTtcbiAgICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDQxKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQ0ID0gXCIpXCI7XG4gICAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0NCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiKVxcXCJcIik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQ0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQwID0gW3Jlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDRdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gKGZ1bmN0aW9uKG9mZnNldCwgYXJncykgeyByZXR1cm4gYXJnczsgfSkocG9zMCwgcmVzdWx0MFsyXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9hcmcoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzO1xuICAgICAgICB2YXIgcG9zMCwgcG9zMTtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdDAgPSBwYXJzZV9leHByKCk7XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgICBwb3MxID0gcG9zO1xuICAgICAgICAgIHJlc3VsdDAgPSBbXTtcbiAgICAgICAgICByZXN1bHQxID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MC5wdXNoKHJlc3VsdDEpO1xuICAgICAgICAgICAgcmVzdWx0MSA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0NCkge1xuICAgICAgICAgICAgICByZXN1bHQxID0gXCIsXCI7XG4gICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIixcXFwiXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQyID0gW107XG4gICAgICAgICAgICAgIHJlc3VsdDMgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDIucHVzaChyZXN1bHQzKTtcbiAgICAgICAgICAgICAgICByZXN1bHQzID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDMgPSBwYXJzZV9leHByKCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0M107XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBleHByKSB7IHJldHVybiBleHByOyB9KShwb3MwLCByZXN1bHQwWzNdKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9vcCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDQ7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgcmVzdWx0MCA9IHBhcnNlX25hbWUoKTtcbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQxID0gW107XG4gICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDEucHVzaChyZXN1bHQyKTtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBwYXJzZV93cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNDIpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MiA9IFwiKlwiO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIqXFxcIlwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNDMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQyID0gXCIrXCI7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIrXFxcIlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdDIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0Nykge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MiA9IFwiL1wiO1xuICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIi9cXFwiXCIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IFtdO1xuICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQzLnB1c2gocmVzdWx0NCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0NCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2VfZXhwcigpO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQ0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQwID0gW3Jlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDRdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gKGZ1bmN0aW9uKG9mZnNldCwgbGVmdCwgc3ltLCByaWdodCkgeyByZXR1cm4gT3AuY3JlYXRlKGxlZnQsIHJpZ2h0LCBzeW0pOyB9KShwb3MwLCByZXN1bHQwWzBdLCByZXN1bHQwWzJdLCByZXN1bHQwWzRdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX3ByaW1pdGl2ZSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDA7XG4gICAgICAgIFxuICAgICAgICByZXN1bHQwID0gcGFyc2VfbmFtZSgpO1xuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBwYXJzZV9zdHIoKTtcbiAgICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MCA9IHBhcnNlX251bSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2VfbmFtZSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDE7XG4gICAgICAgIHZhciBwb3MwO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgaWYgKC9eW2Etel0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgIHBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbYS16XVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDEgPT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoL15bQS1aXS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgIHJlc3VsdDEgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIltBLVpdXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBbXTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MC5wdXNoKHJlc3VsdDEpO1xuICAgICAgICAgICAgaWYgKC9eW2Etel0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbYS16XVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKC9eW0EtWl0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbQS1aXVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gKGZ1bmN0aW9uKG9mZnNldCwgY2hhcnMpIHsgcmV0dXJuIG5ldyBOYW1lKGNoYXJzLmpvaW4oJycpKTsgfSkocG9zMCwgcmVzdWx0MCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9zdHIoKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyO1xuICAgICAgICB2YXIgcG9zMCwgcG9zMTtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIHBvczEgPSBwb3M7XG4gICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDM0KSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFwiXFxcIlwiO1xuICAgICAgICAgIHBvcysrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiXFxcXFxcXCJcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBbXTtcbiAgICAgICAgICBpZiAoL15bXlwiXS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQyID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlteXFxcIl1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlIChyZXN1bHQyICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQxLnB1c2gocmVzdWx0Mik7XG4gICAgICAgICAgICBpZiAoL15bXlwiXS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MiA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlteXFxcIl1cIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdDEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDM0KSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIgPSBcIlxcXCJcIjtcbiAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQyID0gbnVsbDtcbiAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiXFxcXFxcXCJcXFwiXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQwID0gW3Jlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDJdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBjaGFycykgeyByZXR1cm4gbmV3IFN0cihjaGFycy5qb2luKCcnKSk7IH0pKHBvczAsIHJlc3VsdDBbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2VfbnVtKCkge1xuICAgICAgICB2YXIgcmVzdWx0MCwgcmVzdWx0MTtcbiAgICAgICAgdmFyIHBvczA7XG4gICAgICAgIFxuICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICBpZiAoL15bMC05XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICByZXN1bHQxID0gaW5wdXQuY2hhckF0KHBvcyk7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlswLTldXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBbXTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MC5wdXNoKHJlc3VsdDEpO1xuICAgICAgICAgICAgaWYgKC9eWzAtOV0vLnRlc3QoaW5wdXQuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJbMC05XVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBjaGFycykgeyByZXR1cm4gbmV3IE51bShwYXJzZUZsb2F0KGNoYXJzLmpvaW4oJycpKSk7IH0pKHBvczAsIHJlc3VsdDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2Vfd3MoKSB7XG4gICAgICAgIHZhciByZXN1bHQwO1xuICAgICAgICBcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gMzIpIHtcbiAgICAgICAgICByZXN1bHQwID0gXCIgXCI7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIgXFxcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSAxMCkge1xuICAgICAgICAgICAgcmVzdWx0MCA9IFwiXFxuXCI7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiXFxcXG5cXFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjbGVhbnVwRXhwZWN0ZWQoZXhwZWN0ZWQpIHtcbiAgICAgICAgZXhwZWN0ZWQuc29ydCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGxhc3RFeHBlY3RlZCA9IG51bGw7XG4gICAgICAgIHZhciBjbGVhbkV4cGVjdGVkID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZXhwZWN0ZWRbaV0gIT09IGxhc3RFeHBlY3RlZCkge1xuICAgICAgICAgICAgY2xlYW5FeHBlY3RlZC5wdXNoKGV4cGVjdGVkW2ldKTtcbiAgICAgICAgICAgIGxhc3RFeHBlY3RlZCA9IGV4cGVjdGVkW2ldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2xlYW5FeHBlY3RlZDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gY29tcHV0ZUVycm9yUG9zaXRpb24oKSB7XG4gICAgICAgIC8qXG4gICAgICAgICAqIFRoZSBmaXJzdCBpZGVhIHdhcyB0byB1c2UgfFN0cmluZy5zcGxpdHwgdG8gYnJlYWsgdGhlIGlucHV0IHVwIHRvIHRoZVxuICAgICAgICAgKiBlcnJvciBwb3NpdGlvbiBhbG9uZyBuZXdsaW5lcyBhbmQgZGVyaXZlIHRoZSBsaW5lIGFuZCBjb2x1bW4gZnJvbVxuICAgICAgICAgKiB0aGVyZS4gSG93ZXZlciBJRSdzIHxzcGxpdHwgaW1wbGVtZW50YXRpb24gaXMgc28gYnJva2VuIHRoYXQgaXQgd2FzXG4gICAgICAgICAqIGVub3VnaCB0byBwcmV2ZW50IGl0LlxuICAgICAgICAgKi9cbiAgICAgICAgXG4gICAgICAgIHZhciBsaW5lID0gMTtcbiAgICAgICAgdmFyIGNvbHVtbiA9IDE7XG4gICAgICAgIHZhciBzZWVuQ1IgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5tYXgocG9zLCByaWdodG1vc3RGYWlsdXJlc1Bvcyk7IGkrKykge1xuICAgICAgICAgIHZhciBjaCA9IGlucHV0LmNoYXJBdChpKTtcbiAgICAgICAgICBpZiAoY2ggPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgIGlmICghc2VlbkNSKSB7IGxpbmUrKzsgfVxuICAgICAgICAgICAgY29sdW1uID0gMTtcbiAgICAgICAgICAgIHNlZW5DUiA9IGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2ggPT09IFwiXFxyXCIgfHwgY2ggPT09IFwiXFx1MjAyOFwiIHx8IGNoID09PSBcIlxcdTIwMjlcIikge1xuICAgICAgICAgICAgbGluZSsrO1xuICAgICAgICAgICAgY29sdW1uID0gMTtcbiAgICAgICAgICAgIHNlZW5DUiA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbisrO1xuICAgICAgICAgICAgc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geyBsaW5lOiBsaW5lLCBjb2x1bW46IGNvbHVtbiB9O1xuICAgICAgfVxuICAgICAgXG4gICAgICBcbiAgICAgICAgLy8gSW1wb3J0IEFTVCB0eXBlcyBmb3IgYnVpbGRpbmcgdGhlIEFic3RyYWN0IFN5bnRheCBUcmVlLlxuICAgICAgICB2YXIgQVNUID0gcmVxdWlyZSgnLi9BU1QuY29mZmVlJyk7XG4gICAgICAgIHZhciBQcm9ncmFtID0gQVNULlByb2dyYW07XG4gICAgICAgIHZhciBEYXRhID0gQVNULkRhdGE7XG4gICAgICAgIHZhciBTb3VyY2UgPSBBU1QuU291cmNlO1xuICAgICAgICB2YXIgRm5TdG10ID0gQVNULkZuU3RtdDtcbiAgICAgICAgdmFyIFNjYWxlID0gQVNULlNjYWxlO1xuICAgICAgICB2YXIgQ29vcmQgPSBBU1QuQ29vcmQ7XG4gICAgICAgIHZhciBHdWlkZSA9IEFTVC5HdWlkZTtcbiAgICAgICAgdmFyIEVsZW1lbnQgPSBBU1QuRWxlbWVudDtcbiAgICAgICAgdmFyIEZuID0gQVNULkZuO1xuICAgICAgICB2YXIgT3AgPSBBU1QuT3A7XG4gICAgICAgIHZhciBOYW1lID0gQVNULk5hbWU7XG4gICAgICAgIHZhciBTdHIgPSBBU1QuU3RyO1xuICAgICAgICB2YXIgTnVtID0gQVNULk51bTtcbiAgICAgIFxuICAgICAgXG4gICAgICB2YXIgcmVzdWx0ID0gcGFyc2VGdW5jdGlvbnNbc3RhcnRSdWxlXSgpO1xuICAgICAgXG4gICAgICAvKlxuICAgICAgICogVGhlIHBhcnNlciBpcyBub3cgaW4gb25lIG9mIHRoZSBmb2xsb3dpbmcgdGhyZWUgc3RhdGVzOlxuICAgICAgICpcbiAgICAgICAqIDEuIFRoZSBwYXJzZXIgc3VjY2Vzc2Z1bGx5IHBhcnNlZCB0aGUgd2hvbGUgaW5wdXQuXG4gICAgICAgKlxuICAgICAgICogICAgLSB8cmVzdWx0ICE9PSBudWxsfFxuICAgICAgICogICAgLSB8cG9zID09PSBpbnB1dC5sZW5ndGh8XG4gICAgICAgKiAgICAtIHxyaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkfCBtYXkgb3IgbWF5IG5vdCBjb250YWluIHNvbWV0aGluZ1xuICAgICAgICpcbiAgICAgICAqIDIuIFRoZSBwYXJzZXIgc3VjY2Vzc2Z1bGx5IHBhcnNlZCBvbmx5IGEgcGFydCBvZiB0aGUgaW5wdXQuXG4gICAgICAgKlxuICAgICAgICogICAgLSB8cmVzdWx0ICE9PSBudWxsfFxuICAgICAgICogICAgLSB8cG9zIDwgaW5wdXQubGVuZ3RofFxuICAgICAgICogICAgLSB8cmlnaHRtb3N0RmFpbHVyZXNFeHBlY3RlZHwgbWF5IG9yIG1heSBub3QgY29udGFpbiBzb21ldGhpbmdcbiAgICAgICAqXG4gICAgICAgKiAzLiBUaGUgcGFyc2VyIGRpZCBub3Qgc3VjY2Vzc2Z1bGx5IHBhcnNlIGFueSBwYXJ0IG9mIHRoZSBpbnB1dC5cbiAgICAgICAqXG4gICAgICAgKiAgIC0gfHJlc3VsdCA9PT0gbnVsbHxcbiAgICAgICAqICAgLSB8cG9zID09PSAwfFxuICAgICAgICogICAtIHxyaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkfCBjb250YWlucyBhdCBsZWFzdCBvbmUgZmFpbHVyZVxuICAgICAgICpcbiAgICAgICAqIEFsbCBjb2RlIGZvbGxvd2luZyB0aGlzIGNvbW1lbnQgKGluY2x1ZGluZyBjYWxsZWQgZnVuY3Rpb25zKSBtdXN0XG4gICAgICAgKiBoYW5kbGUgdGhlc2Ugc3RhdGVzLlxuICAgICAgICovXG4gICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8IHBvcyAhPT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSBNYXRoLm1heChwb3MsIHJpZ2h0bW9zdEZhaWx1cmVzUG9zKTtcbiAgICAgICAgdmFyIGZvdW5kID0gb2Zmc2V0IDwgaW5wdXQubGVuZ3RoID8gaW5wdXQuY2hhckF0KG9mZnNldCkgOiBudWxsO1xuICAgICAgICB2YXIgZXJyb3JQb3NpdGlvbiA9IGNvbXB1dGVFcnJvclBvc2l0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICB0aHJvdyBuZXcgdGhpcy5TeW50YXhFcnJvcihcbiAgICAgICAgICBjbGVhbnVwRXhwZWN0ZWQocmlnaHRtb3N0RmFpbHVyZXNFeHBlY3RlZCksXG4gICAgICAgICAgZm91bmQsXG4gICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgIGVycm9yUG9zaXRpb24ubGluZSxcbiAgICAgICAgICBlcnJvclBvc2l0aW9uLmNvbHVtblxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgXG4gICAgLyogUmV0dXJucyB0aGUgcGFyc2VyIHNvdXJjZSBjb2RlLiAqL1xuICAgIHRvU291cmNlOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX3NvdXJjZTsgfVxuICB9O1xuICBcbiAgLyogVGhyb3duIHdoZW4gYSBwYXJzZXIgZW5jb3VudGVycyBhIHN5bnRheCBlcnJvci4gKi9cbiAgXG4gIHJlc3VsdC5TeW50YXhFcnJvciA9IGZ1bmN0aW9uKGV4cGVjdGVkLCBmb3VuZCwgb2Zmc2V0LCBsaW5lLCBjb2x1bW4pIHtcbiAgICBmdW5jdGlvbiBidWlsZE1lc3NhZ2UoZXhwZWN0ZWQsIGZvdW5kKSB7XG4gICAgICB2YXIgZXhwZWN0ZWRIdW1hbml6ZWQsIGZvdW5kSHVtYW5pemVkO1xuICAgICAgXG4gICAgICBzd2l0Y2ggKGV4cGVjdGVkLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgZXhwZWN0ZWRIdW1hbml6ZWQgPSBcImVuZCBvZiBpbnB1dFwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgZXhwZWN0ZWRIdW1hbml6ZWQgPSBleHBlY3RlZFswXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBleHBlY3RlZEh1bWFuaXplZCA9IGV4cGVjdGVkLnNsaWNlKDAsIGV4cGVjdGVkLmxlbmd0aCAtIDEpLmpvaW4oXCIsIFwiKVxuICAgICAgICAgICAgKyBcIiBvciBcIlxuICAgICAgICAgICAgKyBleHBlY3RlZFtleHBlY3RlZC5sZW5ndGggLSAxXTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZm91bmRIdW1hbml6ZWQgPSBmb3VuZCA/IHF1b3RlKGZvdW5kKSA6IFwiZW5kIG9mIGlucHV0XCI7XG4gICAgICBcbiAgICAgIHJldHVybiBcIkV4cGVjdGVkIFwiICsgZXhwZWN0ZWRIdW1hbml6ZWQgKyBcIiBidXQgXCIgKyBmb3VuZEh1bWFuaXplZCArIFwiIGZvdW5kLlwiO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLm5hbWUgPSBcIlN5bnRheEVycm9yXCI7XG4gICAgdGhpcy5leHBlY3RlZCA9IGV4cGVjdGVkO1xuICAgIHRoaXMuZm91bmQgPSBmb3VuZDtcbiAgICB0aGlzLm1lc3NhZ2UgPSBidWlsZE1lc3NhZ2UoZXhwZWN0ZWQsIGZvdW5kKTtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICB0aGlzLmxpbmUgPSBsaW5lO1xuICAgIHRoaXMuY29sdW1uID0gY29sdW1uO1xuICB9O1xuICBcbiAgcmVzdWx0LlN5bnRheEVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcbiAgXG4gIHJldHVybiByZXN1bHQ7XG59KSgpO1xuIiwibWF0Y2ggPSByZXF1aXJlICcuL21hdGNoLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmNvbXBhY3QgPSBfLmNvbXBhY3RcblxucHJvY2Vzc0RhdGFTdG10cyA9IChhc3QsIHZhcnMpIC0+XG4gIGRhdGFTdG10cyA9IGV4dHJhY3REYXRhU3RtdHMgYXN0XG4gIGZvciBkYXRhU3RtdCBpbiBkYXRhU3RtdHNcbiAgICBuZXdOYW1lID0gZGF0YVN0bXQubmFtZVxuICAgIG9sZE5hbWUgPSBkYXRhU3RtdC5leHByLnZhbHVlXG4gICAgdmFyc1tuZXdOYW1lXSA9IHZhcnNbb2xkTmFtZV1cbiAgcmV0dXJuIHZhcnNcblxuZXh0cmFjdERhdGFTdG10cyA9IG1hdGNoXG4gIFByb2dyYW06ICh7c3RtdHN9KSAtPlxuICAgIGNvbXBhY3QgbWFwIHN0bXRzLCBleHRyYWN0RGF0YVN0bXRzXG4gIERhdGE6IChkKSAtPiBkXG4gIEFTVDogLT5cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzRGF0YVN0bXRzXG4iLCJtYXRjaCA9IHJlcXVpcmUgJy4vbWF0Y2guY29mZmVlJ1xudHlwZSA9IHJlcXVpcmUgJy4vdHlwZS5jb2ZmZWUnXG5SZWxhdGlvbiA9IHJlcXVpcmUgJy4vUmVsYXRpb24uY29mZmVlJ1xuU2NhbGUgPSByZXF1aXJlICcuL1NjYWxlLmNvZmZlZSdcbkFTVCA9IHJlcXVpcmUgJy4vQVNULmNvZmZlZSdcblByb2dyYW0gPSBBU1QuUHJvZ3JhbVxuRWxlbWVudCA9IEFTVC5FbGVtZW50XG5GbiA9IEFTVC5GblxuYXJnc1RvT3B0aW9ucyA9IHJlcXVpcmUgJy4vYXJnc1RvT3B0aW9ucy5jb2ZmZWUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5cbnByb2Nlc3NTY2FsZVN0bXRzID0gKGFzdCkgLT5cbiAgc2NhbGVzQnlEaW0gPSBleHRyYWN0U2NhbGVzQnlEaW0gYXN0XG4gIHNjYWxlcyA9IG1hdGNoXG4gICAgUHJvZ3JhbTogKHtzdG10c30pIC0+IG5ldyBQcm9ncmFtIG1hcCBzdG10cywgc2NhbGVzXG4jVE9ETyBtYWtlIHRoZSBsYWJlbCBhcmd1bWVudCBvcHRpb25hbCwgcmV2ZXJzZSBvcmRlclxuICAgIEVsZW1lbnQ6ICh7Zm59KSAtPiBuZXcgRWxlbWVudCAnRUxFTUVOVCcsIHNjYWxlcyBmblxuICAgIEZuOiAoe25hbWUsIGFyZ3N9KSAtPiBuZXcgRm4gbmFtZSwgbWFwIGFyZ3MsIHNjYWxlc1xuICAgIFJlbGF0aW9uOiAocmVsYXRpb24pIC0+IGFwcGx5U2NhbGVzIHJlbGF0aW9uLCBzY2FsZXNCeURpbVxuICAgIEFTVDogKGFzdCkgLT4gYXN0XG4gIHJldHVybiBzY2FsZXMgYXN0XG5cbmV4dHJhY3RTY2FsZXNCeURpbSA9IChhc3QpIC0+XG4gIHNjYWxlU3RtdHMgPSBleHRyYWN0U2NhbGVTdG10cyBhc3RcbiAgc2NhbGVzQnlEaW0gPSB7fVxuICBmb3Ige2ZufSBpbiBzY2FsZVN0bXRzXG4gICAge2RpbX0gPSBhcmdzVG9PcHRpb25zIGZuLmFyZ3NcbiAgICBtYWtlU2NhbGUgPSBzY2FsZUZhY3Rvcmllc1tmbi5uYW1lXVxuICAgIHNjYWxlc0J5RGltW2RpbS52YWx1ZV0gPSBtYWtlU2NhbGUoKVxuICByZXR1cm4gc2NhbGVzQnlEaW1cblxuc2NhbGVGYWN0b3JpZXMgPVxuICBsaW5lYXI6IC0+IG5ldyBTY2FsZVxuXG5leHRyYWN0U2NhbGVTdG10cyA9IG1hdGNoXG4gIFByb2dyYW06ICh7c3RtdHN9KSAtPlxuICAgIGNvbXBhY3QgbWFwIHN0bXRzLCBleHRyYWN0U2NhbGVTdG10c1xuICBTY2FsZTogKHMpIC0+IHNcbiAgQVNUOiAtPlxuXG5hcHBseVNjYWxlcyA9IChyZWxhdGlvbiwgc2NhbGVzQnlEaW0pIC0+XG4gIGtleXMgPSByZWxhdGlvbi5rZXlzXG4gIGF0dHJpYnV0ZXMgPSBmb3IgZGltIGluIFsxLi5yZWxhdGlvbi5hdHRyaWJ1dGVzLmxlbmd0aF1cbiAgICBhdHRyaWJ1dGUgPSByZWxhdGlvbi5hdHRyaWJ1dGVzW2RpbS0xXVxuICAgIGlmIHNjYWxlc0J5RGltW2RpbV1cbiAgICAgIHNjYWxlc0J5RGltW2RpbV0uYXBwbHkgYXR0cmlidXRlXG4gICAgZWxzZVxuICAgICAgYXR0cmlidXRlXG4gIG5ldyBSZWxhdGlvbiBrZXlzLCBhdHRyaWJ1dGVzXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvY2Vzc1NjYWxlU3RtdHNcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5hcmdzVG9PcHRpb25zID0gcmVxdWlyZSAnLi9hcmdzVG9PcHRpb25zLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmNvbXBhY3QgPSBfLmNvbXBhY3RcblxucHJvY2Vzc0Nvb3JkU3RtdHMgPSAoYXN0KSAtPlxuICBjb29yZFN0bXRzID0gZXh0cmFjdENvb3JkU3RtdHMgYXN0XG4gIGlmIGNvb3JkU3RtdHMubGVuZ3RoICE9IDFcbiAgICB0aHJvdyBFcnJvciBcIkV4YWN0bHkgMSBDT09SRCBzdGF0ZW1lbnQgZXhwZWN0ZWQsIGdvdCAje2Nvb3JkU3RtdHMubGVuZ3RofVwiXG4gIHtmbn0gPSBjb29yZFN0bXRzWzBdXG4gIHtkaW19ID0gYXJnc1RvT3B0aW9ucyBmbi5hcmdzXG4gIG1ha2VDb29yZGluYXRlcyA9IGNvb3JkRmFjdG9yaWVzW2ZuLm5hbWVdXG4gIG1ha2VDb29yZGluYXRlcyhkaW0pXG5cbmV4dHJhY3RDb29yZFN0bXRzID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+XG4gICAgY29tcGFjdCBtYXAgc3RtdHMsIGV4dHJhY3RDb29yZFN0bXRzXG4gIENvb3JkOiAoYykgLT4gY1xuICBBU1Q6IC0+XG5cbmNvb3JkRmFjdG9yaWVzID1cbiAgcmVjdDogKGRpbSkgLT4gbmV3IENvb3JkaW5hdGVTcGFjZVxuXG5jbGFzcyBDb29yZGluYXRlU3BhY2VcblxubW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzQ29vcmRTdG10c1xuIiwibWF0Y2ggPSByZXF1aXJlICcuL21hdGNoLmNvZmZlZSdcblJlbGF0aW9uID0gcmVxdWlyZSAnLi9SZWxhdGlvbi5jb2ZmZWUnXG5BU1QgPSByZXF1aXJlICcuL0FTVC5jb2ZmZWUnXG5Qcm9ncmFtID0gQVNULlByb2dyYW1cbkVsZW1lbnQgPSBBU1QuRWxlbWVudFxuRm4gPSBBU1QuRm5cbkNyb3NzID0gQVNULkNyb3NzXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5cbiMgZXZhbHVhdGVBbGdlYnJhKGFzdCwgdmFycykgLT4gYXN0XG4jIHdoZXJlIE9wIGV4cHJlc3Npb25zIGFyZSByZXBsYWNlZCBieSBSZWxhdGlvbnNcblxuZXZhbHVhdGVBbGdlYnJhID0gKGFzdCwgdmFycykgLT5cbiAgYWxnZWJyYSA9IG1hdGNoXG4gICAgUHJvZ3JhbTogKHtzdG10c30pIC0+IG5ldyBQcm9ncmFtIG1hcCBzdG10cywgYWxnZWJyYVxuICAgIEVsZW1lbnQ6ICh7Zm59KSAtPiBuZXcgRWxlbWVudCAnRUxFTUVOVCcsIGFsZ2VicmEgZm5cbiAgICBGbjogKHtuYW1lLCBhcmdzfSkgLT4gbmV3IEZuIG5hbWUsIG1hcCBhcmdzLCBhbGdlYnJhXG4gICAgQ3Jvc3M6ICh7bGVmdCwgcmlnaHQsIHN5bX0pIC0+XG4gICAgICBSZWxhdGlvbi5jcm9zcyAoYWxnZWJyYSBsZWZ0KSwgKGFsZ2VicmEgcmlnaHQpXG4gICAgTmFtZTogKHt2YWx1ZX0pIC0+IFJlbGF0aW9uLmZyb21BdHRyaWJ1dGUgdmFyc1t2YWx1ZV1cbiAgICBBU1Q6IChhc3QpIC0+IGFzdFxuICBhbGdlYnJhIGFzdFxuXG5cbiMgVE9ETyByZW5hbWUgZmlsZSB0byBhbGdlYnJhLmNvZmZlZVxubW9kdWxlLmV4cG9ydHMgPSBldmFsdWF0ZUFsZ2VicmFcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5tYXAgPSAocmVxdWlyZSAndW5kZXJzY29yZScpLm1hcFxuXG5zaG93ID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+IChtYXAgc3RtdHMsIHNob3cpLmpvaW4gJ1xcbidcbiAgRGF0YTogKHtuYW1lLCBleHByfSkgLT4gXCJEQVRBOiAje25hbWV9ID0gI3tzaG93IGV4cHJ9XCJcbiAgU291cmNlOiAoe2NzdlBhdGh9KSAtPiBcIlNPVVJDRTogXFxcIiN7Y3N2UGF0aH1cXFwiXCJcbiAgRm5TdG10IDogKHtsYWJlbCwgZm59KSAtPiBcIiN7bGFiZWx9OiAje3Nob3cgZm59XCJcbiAgUHJpbWl0aXZlOiAoe3ZhbHVlfSkgLT4gdmFsdWVcbiAgU3RyOiAoe3ZhbHVlfSkgLT4gJ1wiJyt2YWx1ZSsnXCInXG4gIEZuOiAoe25hbWUsIGFyZ3N9KSAtPiBcIiN7bmFtZX0oI3sobWFwIGFyZ3MsIHNob3cpLmpvaW4gJywgJ30pXCJcbiAgT3A6ICh7bGVmdCwgcmlnaHQsIHN5bX0pIC0+IFwiI3tzaG93IGxlZnR9I3tzeW19I3tzaG93IHJpZ2h0fVwiXG4gICNSZWxhdGlvbjogKHIpIC0+IFwiPFJlbGF0aW9uIHdpdGggI3tyLm0oKX0gcm93cyBhbmQgI3tyLm4oKX0gY29sdW1ucz5cIlxuICBSZWxhdGlvbjogKHIpIC0+IFwiXFxuXCIrci50b0NTVigpK1wiXFxuXCJcblxubW9kdWxlLmV4cG9ydHMgPSBzaG93XG4iLCJ0eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcblJlbGF0aW9uID0gcmVxdWlyZSAnLi9SZWxhdGlvbi5jb2ZmZWUnXG5BdHRyaWJ1dGUgPSBSZWxhdGlvbi5BdHRyaWJ1dGVcbkludGVydmFsID0gcmVxdWlyZSAnLi9JbnRlcnZhbC5jb2ZmZWUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1pbiA9IF8ubWluXG5tYXggPSBfLm1heFxuXG5jbGFzcyBTY2FsZVxuICBhcHBseTogKGF0dHJpYnV0ZSkgLT5cbiAgICB0eXBlIGF0dHJpYnV0ZSwgQXR0cmlidXRlXG4gICAgdmFsdWVzID0gYXR0cmlidXRlLnZhbHVlcygpXG4gICAgc3JjID0gbmV3IEludGVydmFsIChtaW4gdmFsdWVzKSwgKG1heCB2YWx1ZXMpXG4gICAgZGVzdCA9IG5ldyBJbnRlcnZhbCAwLCAxXG4gICAgbm9ybWFsaXplID0gKGtleSkgLT4gc3JjLnRvIGRlc3QsIGF0dHJpYnV0ZS5tYXBba2V5XVxuXG4gICAgbmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAga2V5cyA9IGF0dHJpYnV0ZS5rZXlzXG4gICAgbWFwID0ge31cbiAgICBmb3Iga2V5IGluIGtleXNcbiAgICAgIG1hcFtrZXldID0gbm9ybWFsaXplIGtleVxuICAgIG5ldyBBdHRyaWJ1dGUgbmFtZSwga2V5cywgbWFwXG5cbm1vZHVsZS5leHBvcnRzID0gU2NhbGVcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5nZXRGaWxlID0gcmVxdWlyZSAnLi9nZXRGaWxlLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmNvbXBhY3QgPSBfLmNvbXBhY3RcbmFzeW5jID0gcmVxdWlyZSAnYXN5bmMnXG5SZWxhdGlvbiA9IHJlcXVpcmUgJy4vUmVsYXRpb24uY29mZmVlJ1xuXG4jIGNhbGxiYWNrKGVyciwgdmFyczpNYXA8U3RyaW5nLCBSZWxhdGlvbi5BdHRyaWJ1dGU+KVxucHJvY2Vzc1NvdXJjZVN0bXRzID0gKGFzdCwgY2FsbGJhY2spIC0+XG4gIHNvdXJjZXMgPSBleHRyYWN0U291cmNlcyBhc3RcbiAgZ2V0UmVsYXRpb25zIHNvdXJjZXMsIChlcnIsIHJlbGF0aW9ucykgLT5cbiAgICB2YXJzID0ge31cbiAgICBmb3IgcmVsYXRpb24gaW4gcmVsYXRpb25zXG4gICAgICBmb3IgYXR0ciBpbiByZWxhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAgIHZhcnNbYXR0ci5uYW1lXSA9IGF0dHJcbiAgICBjYWxsYmFjayBudWxsLCB2YXJzXG5cbiNUT0RPIHJlbmFtZSB0byBleHRyYWN0U291cmNlU3RtdHNcbmV4dHJhY3RTb3VyY2VzID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+XG4gICAgY29tcGFjdCBtYXAgc3RtdHMsIGV4dHJhY3RTb3VyY2VzXG4gIFNvdXJjZTogKHMpIC0+IHNcbiAgQVNUOiAtPlxuXG4jIGNhbGxiYWNrKGVyciwgW1tuYW1lOlN0cmluZywgUmVsYXRpb25dXSlcbmdldFJlbGF0aW9ucyA9IChzb3VyY2VzLCBjYWxsYmFjaykgLT5cbiAgYXN5bmMubWFwIHNvdXJjZXMsIGdldFJlbGF0aW9uLCBjYWxsYmFja1xuXG4jIGNhbGxiYWNrKGVyciwgW25hbWU6U3RyaW5nLCBSZWxhdGlvbl0pXG5nZXRSZWxhdGlvbiA9IChzb3VyY2UsIGNhbGxiYWNrKSAtPlxuICBnZXRGaWxlIHNvdXJjZS5jc3ZQYXRoLCAoZXJyLCBjc3ZUZXh0KSAtPlxuICAgIGlmIGVyciB0aGVuIGNhbGxiYWNrIGVyclxuICAgIHRhYmxlID0gJC5jc3YudG9BcnJheXMgY3N2VGV4dFxuICAgIHJlbGF0aW9uID0gUmVsYXRpb24uZnJvbVRhYmxlIHRhYmxlXG4gICAgY2FsbGJhY2sgbnVsbCwgcmVsYXRpb25cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzU291cmNlU3RtdHNcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYuc291cmNlID09PSB3aW5kb3cgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uKHByb2Nlc3Mpey8qZ2xvYmFsIHNldEltbWVkaWF0ZTogZmFsc2UsIHNldFRpbWVvdXQ6IGZhbHNlLCBjb25zb2xlOiBmYWxzZSAqL1xuKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBhc3luYyA9IHt9O1xuXG4gICAgLy8gZ2xvYmFsIG9uIHRoZSBzZXJ2ZXIsIHdpbmRvdyBpbiB0aGUgYnJvd3NlclxuICAgIHZhciByb290LCBwcmV2aW91c19hc3luYztcblxuICAgIHJvb3QgPSB0aGlzO1xuICAgIGlmIChyb290ICE9IG51bGwpIHtcbiAgICAgIHByZXZpb3VzX2FzeW5jID0gcm9vdC5hc3luYztcbiAgICB9XG5cbiAgICBhc3luYy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByb290LmFzeW5jID0gcHJldmlvdXNfYXN5bmM7XG4gICAgICAgIHJldHVybiBhc3luYztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkgdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLlwiKTtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICBmbi5hcHBseShyb290LCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vLyBjcm9zcy1icm93c2VyIGNvbXBhdGlibGl0eSBmdW5jdGlvbnMgLy8vL1xuXG4gICAgdmFyIF9lYWNoID0gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IpIHtcbiAgICAgICAgaWYgKGFyci5mb3JFYWNoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLmZvckVhY2goaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbaV0sIGksIGFycik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF9tYXAgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvcikge1xuICAgICAgICBpZiAoYXJyLm1hcCkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5tYXAoaXRlcmF0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvcih4LCBpLCBhKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG4gICAgdmFyIF9yZWR1Y2UgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgbWVtbykge1xuICAgICAgICBpZiAoYXJyLnJlZHVjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGFyci5yZWR1Y2UoaXRlcmF0b3IsIG1lbW8pO1xuICAgICAgICB9XG4gICAgICAgIF9lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGksIGEpIHtcbiAgICAgICAgICAgIG1lbW8gPSBpdGVyYXRvcihtZW1vLCB4LCBpLCBhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG5cbiAgICB2YXIgX2tleXMgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcblxuICAgIC8vLy8gZXhwb3J0ZWQgYXN5bmMgbW9kdWxlIGZ1bmN0aW9ucyAvLy8vXG5cbiAgICAvLy8vIG5leHRUaWNrIGltcGxlbWVudGF0aW9uIHdpdGggYnJvd3Nlci1jb21wYXRpYmxlIGZhbGxiYWNrIC8vLy9cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnIHx8ICEocHJvY2Vzcy5uZXh0VGljaykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhc3luYy5uZXh0VGljayA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICAgIH1cblxuICAgIGFzeW5jLmVhY2ggPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgX2VhY2goYXJyLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgaXRlcmF0b3IoeCwgb25seV9vbmNlKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlZCA+PSBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5mb3JFYWNoID0gYXN5bmMuZWFjaDtcblxuICAgIGFzeW5jLmVhY2hTZXJpZXMgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29tcGxldGVkID0gMDtcbiAgICAgICAgdmFyIGl0ZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgICAgICBpdGVyYXRvcihhcnJbY29tcGxldGVkXSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3luYy5uZXh0VGljayhpdGVyYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBpdGVyYXRlKCk7XG4gICAgfTtcbiAgICBhc3luYy5mb3JFYWNoU2VyaWVzID0gYXN5bmMuZWFjaFNlcmllcztcblxuICAgIGFzeW5jLmVhY2hMaW1pdCA9IGZ1bmN0aW9uIChhcnIsIGxpbWl0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGZuID0gX2VhY2hMaW1pdChsaW1pdCk7XG4gICAgICAgIGZuLmFwcGx5KG51bGwsIFthcnIsIGl0ZXJhdG9yLCBjYWxsYmFja10pO1xuICAgIH07XG4gICAgYXN5bmMuZm9yRWFjaExpbWl0ID0gYXN5bmMuZWFjaExpbWl0O1xuXG4gICAgdmFyIF9lYWNoTGltaXQgPSBmdW5jdGlvbiAobGltaXQpIHtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgaWYgKCFhcnIubGVuZ3RoIHx8IGxpbWl0IDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ZWQgPSAwO1xuICAgICAgICAgICAgdmFyIHJ1bm5pbmcgPSAwO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24gcmVwbGVuaXNoICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgPCBsaW1pdCAmJiBzdGFydGVkIDwgYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaXRlcmF0b3IoYXJyW3N0YXJ0ZWQgLSAxXSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICB2YXIgZG9QYXJhbGxlbCA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIFthc3luYy5lYWNoXS5jb25jYXQoYXJncykpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgdmFyIGRvUGFyYWxsZWxMaW1pdCA9IGZ1bmN0aW9uKGxpbWl0LCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIFtfZWFjaExpbWl0KGxpbWl0KV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHZhciBkb1NlcmllcyA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIFthc3luYy5lYWNoU2VyaWVzXS5jb25jYXQoYXJncykpO1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIHZhciBfYXN5bmNNYXAgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBhcnIgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW5kZXg6IGksIHZhbHVlOiB4fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeC52YWx1ZSwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbeC5pbmRleF0gPSB2O1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5tYXAgPSBkb1BhcmFsbGVsKF9hc3luY01hcCk7XG4gICAgYXN5bmMubWFwU2VyaWVzID0gZG9TZXJpZXMoX2FzeW5jTWFwKTtcbiAgICBhc3luYy5tYXBMaW1pdCA9IGZ1bmN0aW9uIChhcnIsIGxpbWl0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9tYXBMaW1pdChsaW1pdCkoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB2YXIgX21hcExpbWl0ID0gZnVuY3Rpb24obGltaXQpIHtcbiAgICAgICAgcmV0dXJuIGRvUGFyYWxsZWxMaW1pdChsaW1pdCwgX2FzeW5jTWFwKTtcbiAgICB9O1xuXG4gICAgLy8gcmVkdWNlIG9ubHkgaGFzIGEgc2VyaWVzIHZlcnNpb24sIGFzIGRvaW5nIHJlZHVjZSBpbiBwYXJhbGxlbCB3b24ndFxuICAgIC8vIHdvcmsgaW4gbWFueSBzaXR1YXRpb25zLlxuICAgIGFzeW5jLnJlZHVjZSA9IGZ1bmN0aW9uIChhcnIsIG1lbW8sIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5lYWNoU2VyaWVzKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcihtZW1vLCB4LCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICAgICAgbWVtbyA9IHY7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG1lbW8pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIGluamVjdCBhbGlhc1xuICAgIGFzeW5jLmluamVjdCA9IGFzeW5jLnJlZHVjZTtcbiAgICAvLyBmb2xkbCBhbGlhc1xuICAgIGFzeW5jLmZvbGRsID0gYXN5bmMucmVkdWNlO1xuXG4gICAgYXN5bmMucmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoYXJyLCBtZW1vLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJldmVyc2VkID0gX21hcChhcnIsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfSkucmV2ZXJzZSgpO1xuICAgICAgICBhc3luYy5yZWR1Y2UocmV2ZXJzZWQsIG1lbW8sIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcbiAgICAvLyBmb2xkciBhbGlhc1xuICAgIGFzeW5jLmZvbGRyID0gYXN5bmMucmVkdWNlUmlnaHQ7XG5cbiAgICB2YXIgX2ZpbHRlciA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGFyciA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtpbmRleDogaSwgdmFsdWU6IHh9O1xuICAgICAgICB9KTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LnZhbHVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhfbWFwKHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmZpbHRlciA9IGRvUGFyYWxsZWwoX2ZpbHRlcik7XG4gICAgYXN5bmMuZmlsdGVyU2VyaWVzID0gZG9TZXJpZXMoX2ZpbHRlcik7XG4gICAgLy8gc2VsZWN0IGFsaWFzXG4gICAgYXN5bmMuc2VsZWN0ID0gYXN5bmMuZmlsdGVyO1xuICAgIGFzeW5jLnNlbGVjdFNlcmllcyA9IGFzeW5jLmZpbHRlclNlcmllcztcblxuICAgIHZhciBfcmVqZWN0ID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgYXJyID0gX21hcChhcnIsIGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2luZGV4OiBpLCB2YWx1ZTogeH07XG4gICAgICAgIH0pO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgudmFsdWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhfbWFwKHJlc3VsdHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmluZGV4IC0gYi5pbmRleDtcbiAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLnJlamVjdCA9IGRvUGFyYWxsZWwoX3JlamVjdCk7XG4gICAgYXN5bmMucmVqZWN0U2VyaWVzID0gZG9TZXJpZXMoX3JlamVjdCk7XG5cbiAgICB2YXIgX2RldGVjdCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIG1haW5fY2FsbGJhY2spIHtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrKHgpO1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBtYWluX2NhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMuZGV0ZWN0ID0gZG9QYXJhbGxlbChfZGV0ZWN0KTtcbiAgICBhc3luYy5kZXRlY3RTZXJpZXMgPSBkb1NlcmllcyhfZGV0ZWN0KTtcblxuICAgIGFzeW5jLnNvbWUgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgbWFpbl9jYWxsYmFjaykge1xuICAgICAgICBhc3luYy5lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBtYWluX2NhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBhbnkgYWxpYXNcbiAgICBhc3luYy5hbnkgPSBhc3luYy5zb21lO1xuXG4gICAgYXN5bmMuZXZlcnkgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgbWFpbl9jYWxsYmFjaykge1xuICAgICAgICBhc3luYy5lYWNoKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGlmICghdikge1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIG1haW5fY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gYWxsIGFsaWFzXG4gICAgYXN5bmMuYWxsID0gYXN5bmMuZXZlcnk7XG5cbiAgICBhc3luYy5zb3J0QnkgPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgYXN5bmMubWFwKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBmdW5jdGlvbiAoZXJyLCBjcml0ZXJpYSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHt2YWx1ZTogeCwgY3JpdGVyaWE6IGNyaXRlcmlhfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWEsIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgX21hcChyZXN1bHRzLnNvcnQoZm4pLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geC52YWx1ZTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBhc3luYy5hdXRvID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICB2YXIga2V5cyA9IF9rZXlzKHRhc2tzKTtcbiAgICAgICAgaWYgKCFrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdHMgPSB7fTtcblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gW107XG4gICAgICAgIHZhciBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnVuc2hpZnQoZm4pO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyc1tpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHRhc2tDb21wbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9lYWNoKGxpc3RlbmVycy5zbGljZSgwKSwgZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfa2V5cyhyZXN1bHRzKS5sZW5ndGggPT09IGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgX2VhY2goa2V5cywgZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gKHRhc2tzW2tdIGluc3RhbmNlb2YgRnVuY3Rpb24pID8gW3Rhc2tzW2tdXTogdGFza3Nba107XG4gICAgICAgICAgICB2YXIgdGFza0NhbGxiYWNrID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2FmZVJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgX2VhY2goX2tleXMocmVzdWx0cyksIGZ1bmN0aW9uKHJrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhZmVSZXN1bHRzW3JrZXldID0gcmVzdWx0c1tya2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNhZmVSZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBzYWZlUmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3Agc3Vic2VxdWVudCBlcnJvcnMgaGl0dGluZyBjYWxsYmFjayBtdWx0aXBsZSB0aW1lc1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKHRhc2tDb21wbGV0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciByZXF1aXJlcyA9IHRhc2suc2xpY2UoMCwgTWF0aC5hYnModGFzay5sZW5ndGggLSAxKSkgfHwgW107XG4gICAgICAgICAgICB2YXIgcmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9yZWR1Y2UocmVxdWlyZXMsIGZ1bmN0aW9uIChhLCB4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoYSAmJiByZXN1bHRzLmhhc093blByb3BlcnR5KHgpKTtcbiAgICAgICAgICAgICAgICB9LCB0cnVlKSAmJiAhcmVzdWx0cy5oYXNPd25Qcm9wZXJ0eShrKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAocmVhZHkoKSkge1xuICAgICAgICAgICAgICAgIHRhc2tbdGFzay5sZW5ndGggLSAxXSh0YXNrQ2FsbGJhY2ssIHJlc3VsdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVhZHkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLndhdGVyZmFsbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKCF0YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3cmFwSXRlcmF0b3IgPSBmdW5jdGlvbiAoaXRlcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MucHVzaCh3cmFwSXRlcmF0b3IobmV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBhc3luYy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRvci5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgd3JhcEl0ZXJhdG9yKGFzeW5jLml0ZXJhdG9yKHRhc2tzKSkoKTtcbiAgICB9O1xuXG4gICAgdmFyIF9wYXJhbGxlbCA9IGZ1bmN0aW9uKGVhY2hmbiwgdGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgIGlmICh0YXNrcy5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGVhY2hmbi5tYXAodGFza3MsIGZ1bmN0aW9uIChmbiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm4oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgZXJyLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgIGVhY2hmbi5lYWNoKF9rZXlzKHRhc2tzKSwgZnVuY3Rpb24gKGssIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGFza3Nba10oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMucGFyYWxsZWwgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9wYXJhbGxlbCh7IG1hcDogYXN5bmMubWFwLCBlYWNoOiBhc3luYy5lYWNoIH0sIHRhc2tzLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLnBhcmFsbGVsTGltaXQgPSBmdW5jdGlvbih0YXNrcywgbGltaXQsIGNhbGxiYWNrKSB7XG4gICAgICAgIF9wYXJhbGxlbCh7IG1hcDogX21hcExpbWl0KGxpbWl0KSwgZWFjaDogX2VhY2hMaW1pdChsaW1pdCkgfSwgdGFza3MsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuc2VyaWVzID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAodGFza3MuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICBhc3luYy5tYXBTZXJpZXModGFza3MsIGZ1bmN0aW9uIChmbiwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICAgICAgZm4oZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmdzID0gYXJnc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwobnVsbCwgZXJyLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICAgICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoX2tleXModGFza3MpLCBmdW5jdGlvbiAoaywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0YXNrc1trXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5pdGVyYXRvciA9IGZ1bmN0aW9uICh0YXNrcykge1xuICAgICAgICB2YXIgbWFrZUNhbGxiYWNrID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrc1tpbmRleF0uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLm5leHQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmbi5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoaW5kZXggPCB0YXNrcy5sZW5ndGggLSAxKSA/IG1ha2VDYWxsYmFjayhpbmRleCArIDEpOiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBmbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG1ha2VDYWxsYmFjaygwKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuYXBwbHkgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KFxuICAgICAgICAgICAgICAgIG51bGwsIGFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX2NvbmNhdCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgZm4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByID0gW107XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYikge1xuICAgICAgICAgICAgZm4oeCwgZnVuY3Rpb24gKGVyciwgeSkge1xuICAgICAgICAgICAgICAgIHIgPSByLmNvbmNhdCh5IHx8IFtdKTtcbiAgICAgICAgICAgICAgICBjYihlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMuY29uY2F0ID0gZG9QYXJhbGxlbChfY29uY2F0KTtcbiAgICBhc3luYy5jb25jYXRTZXJpZXMgPSBkb1NlcmllcyhfY29uY2F0KTtcblxuICAgIGFzeW5jLndoaWxzdCA9IGZ1bmN0aW9uICh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRlc3QoKSkge1xuICAgICAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLndoaWxzdCh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLndoaWxzdCh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1doaWxzdCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVzdCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMuZG9XaGlsc3QoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5kb1doaWxzdChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzeW5jID0gZmFsc2U7XG4gICAgfTtcblxuICAgIGFzeW5jLnVudGlsID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRlc3QoKSkge1xuICAgICAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgaXRlcmF0b3IoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLnVudGlsKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMudW50aWwodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYXN5bmMuZG9VbnRpbCA9IGZ1bmN0aW9uIChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRlc3QoKSkge1xuICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLmRvVW50aWwoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5kb1VudGlsKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHN5bmMgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgYXN5bmMucXVldWUgPSBmdW5jdGlvbiAod29ya2VyLCBjb25jdXJyZW5jeSkge1xuICAgICAgICBpZiAoY29uY3VycmVuY3kgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uY3VycmVuY3kgPSAxO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIF9pbnNlcnQocSwgZGF0YSwgcG9zLCBjYWxsYmFjaykge1xuICAgICAgICAgIGlmKGRhdGEuY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAgICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgICAgfVxuICAgICAgICAgIF9lYWNoKGRhdGEsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICAgICAgICBkYXRhOiB0YXNrLFxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrIDogbnVsbFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGlmIChwb3MpIHtcbiAgICAgICAgICAgICAgICBxLnRhc2tzLnVuc2hpZnQoaXRlbSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcS50YXNrcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHEuc2F0dXJhdGVkICYmIHEudGFza3MubGVuZ3RoID09PSBjb25jdXJyZW5jeSkge1xuICAgICAgICAgICAgICAgICAgcS5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhc3luYy5uZXh0VGljayhxLnByb2Nlc3MpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHdvcmtlcnMgPSAwO1xuICAgICAgICB2YXIgcSA9IHtcbiAgICAgICAgICAgIHRhc2tzOiBbXSxcbiAgICAgICAgICAgIGNvbmN1cnJlbmN5OiBjb25jdXJyZW5jeSxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgX2luc2VydChxLCBkYXRhLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuc2hpZnQ6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIHRydWUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9jZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmtlcnMgPCBxLmNvbmN1cnJlbmN5ICYmIHEudGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXNrID0gcS50YXNrcy5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocS5lbXB0eSAmJiBxLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcnMgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtlcnMgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXNrLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFzay5jYWxsYmFjay5hcHBseSh0YXNrLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHEuZHJhaW4gJiYgcS50YXNrcy5sZW5ndGggKyB3b3JrZXJzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcS5kcmFpbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcS5wcm9jZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYiA9IG9ubHlfb25jZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2JBcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3luYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dC5hcHBseShudWxsLCBjYkFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB3b3JrZXIodGFzay5kYXRhLCBjYik7XG4gICAgICAgICAgICAgICAgICAgIHN5bmMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHEudGFza3MubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJ1bm5pbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd29ya2VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgfTtcblxuICAgIGFzeW5jLmNhcmdvID0gZnVuY3Rpb24gKHdvcmtlciwgcGF5bG9hZCkge1xuICAgICAgICB2YXIgd29ya2luZyAgICAgPSBmYWxzZSxcbiAgICAgICAgICAgIHRhc2tzICAgICAgID0gW107XG5cbiAgICAgICAgdmFyIGNhcmdvID0ge1xuICAgICAgICAgICAgdGFza3M6IHRhc2tzLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgICAgIHNhdHVyYXRlZDogbnVsbCxcbiAgICAgICAgICAgIGVtcHR5OiBudWxsLFxuICAgICAgICAgICAgZHJhaW46IG51bGwsXG4gICAgICAgICAgICBwdXNoOiBmdW5jdGlvbiAoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhLmNvbnN0cnVjdG9yICE9PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhID0gW2RhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfZWFjaChkYXRhLCBmdW5jdGlvbih0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogdGFzayxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgPyBjYWxsYmFjayA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYXJnby5zYXR1cmF0ZWQgJiYgdGFza3MubGVuZ3RoID09PSBwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJnby5zYXR1cmF0ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGNhcmdvLnByb2Nlc3MpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIHByb2Nlc3MoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdvcmtpbmcpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNhcmdvLmRyYWluKSBjYXJnby5kcmFpbigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHRzID0gdHlwZW9mIHBheWxvYWQgPT09ICdudW1iZXInXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0YXNrcy5zcGxpY2UoMCwgcGF5bG9hZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRhc2tzLnNwbGljZSgwKTtcblxuICAgICAgICAgICAgICAgIHZhciBkcyA9IF9tYXAodHMsIGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXNrLmRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZihjYXJnby5lbXB0eSkgY2FyZ28uZW1wdHkoKTtcbiAgICAgICAgICAgICAgICB3b3JraW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB3b3JrZXIoZHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd29ya2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICBfZWFjaCh0cywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYWxsYmFjay5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvY2VzcygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlbmd0aDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrcy5sZW5ndGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3b3JraW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gY2FyZ287XG4gICAgfTtcblxuICAgIHZhciBfY29uc29sZV9mbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KFtmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY29uc29sZVtuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2VhY2goYXJncywgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlW25hbWVdKHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XSkpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgYXN5bmMubG9nID0gX2NvbnNvbGVfZm4oJ2xvZycpO1xuICAgIGFzeW5jLmRpciA9IF9jb25zb2xlX2ZuKCdkaXInKTtcbiAgICAvKmFzeW5jLmluZm8gPSBfY29uc29sZV9mbignaW5mbycpO1xuICAgIGFzeW5jLndhcm4gPSBfY29uc29sZV9mbignd2FybicpO1xuICAgIGFzeW5jLmVycm9yID0gX2NvbnNvbGVfZm4oJ2Vycm9yJyk7Ki9cblxuICAgIGFzeW5jLm1lbW9pemUgPSBmdW5jdGlvbiAoZm4sIGhhc2hlcikge1xuICAgICAgICB2YXIgbWVtbyA9IHt9O1xuICAgICAgICB2YXIgcXVldWVzID0ge307XG4gICAgICAgIGhhc2hlciA9IGhhc2hlciB8fCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKGtleSBpbiBtZW1vKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgbWVtb1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGtleSBpbiBxdWV1ZXMpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZXNba2V5XS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHF1ZXVlc1trZXldID0gW2NhbGxiYWNrXTtcbiAgICAgICAgICAgICAgICBmbi5hcHBseShudWxsLCBhcmdzLmNvbmNhdChbZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZW1vW2tleV0gPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBxID0gcXVldWVzW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBxdWV1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBxLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgIHFbaV0uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1dKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIG1lbW9pemVkLm1lbW8gPSBtZW1vO1xuICAgICAgICBtZW1vaXplZC51bm1lbW9pemVkID0gZm47XG4gICAgICAgIHJldHVybiBtZW1vaXplZDtcbiAgICB9O1xuXG4gICAgYXN5bmMudW5tZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKGZuLnVubWVtb2l6ZWQgfHwgZm4pLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBhc3luYy50aW1lcyA9IGZ1bmN0aW9uIChjb3VudCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgY291bnRlci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc3luYy5tYXAoY291bnRlciwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMudGltZXNTZXJpZXMgPSBmdW5jdGlvbiAoY291bnQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgY291bnRlciA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIGNvdW50ZXIucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXN5bmMubWFwU2VyaWVzKGNvdW50ZXIsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIGFzeW5jLmNvbXBvc2UgPSBmdW5jdGlvbiAoLyogZnVuY3Rpb25zLi4uICovKSB7XG4gICAgICAgIHZhciBmbnMgPSBBcnJheS5wcm90b3R5cGUucmV2ZXJzZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBhcmdzLnBvcCgpO1xuICAgICAgICAgICAgYXN5bmMucmVkdWNlKGZucywgYXJncywgZnVuY3Rpb24gKG5ld2FyZ3MsIGZuLCBjYikge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIG5ld2FyZ3MuY29uY2F0KFtmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnIgPSBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0YXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgIGNiKGVyciwgbmV4dGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1dKSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodGhhdCwgW2Vycl0uY29uY2F0KHJlc3VsdHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBhc3luYy5hcHBseUVhY2ggPSBmdW5jdGlvbiAoZm5zIC8qYXJncy4uLiovKSB7XG4gICAgICAgIHZhciBnbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICByZXR1cm4gYXN5bmMuZWFjaChmbnMsIGZ1bmN0aW9uIChmbiwgY2IpIHtcbiAgICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzLmNvbmNhdChbY2JdKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBnby5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnbztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBBTUQgLyBSZXF1aXJlSlNcbiAgICBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3luYztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIE5vZGUuanNcbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGFzeW5jO1xuICAgIH1cbiAgICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXG4gICAgZWxzZSB7XG4gICAgICAgIHJvb3QuYXN5bmMgPSBhc3luYztcbiAgICB9XG5cbn0oKSk7XG5cbn0pKHJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSkiLCIjY2hlY2tUeXBlT2YgPSAob2JqLCB0eXBlU3RyKSAtPlxuIyAgaWYgdHlwZW9mIG9iaiAhPSB0eXBlU3RyXG4jICAgIHRocm93IEVycm9yIFwiXCJcIlxuIyAgICAgIFR5cGUgRXJyb3I6IGV4cGVjdGVkICh0eXBlb2YpICcje3R5cGVTdHJ9JyxcbiMgICAgICAgIGdvdCB0eXBlICN7dHlwZW9mIG9ian1cbiMgICAgXCJcIlwiXG4jbW9kdWxlLmV4cG9ydHMgPSAob2JqLCB0KSAtPlxuIyAgaWYgb2JqID09IHVuZGVmaW5lZFxuIyAgICB0aHJvdyBFcnJvciAnRmlyc3QgYXJndW1lbnQgdG8gdHlwZSgpIGlzIG51bGwnXG4jICBpZiB0ID09IHVuZGVmaW5lZFxuIyAgICB0aHJvdyBFcnJvciAnU2Vjb25kIGFyZ3VtZW50IHRvIHR5cGUoKSBpcyBudWxsJ1xuIyAgaWYgdCA9PSBOdW1iZXJcbiMgICAgY2hlY2tUeXBlT2Ygb2JqLCAnbnVtYmVyJ1xuIyAgZWxzZSBpZiB0ID09IFN0cmluZ1xuIyAgICBjaGVja1R5cGVPZiBvYmosICdzdHJpbmcnXG4jICBlbHNlIGlmIG9iai5jb25zdHJ1Y3RvciAhPSB0XG4jICAgIGNvbnN0ciA9IG9iai5jb25zdHJ1Y3RvclxuIyAgICBzaG91bGRFcnJvciA9IGNvbnN0ciAhPSB0XG4jICAgIHdoaWxlIHNob3VsZEVycm9yIGFuZCBjb25zdHI/Ll9fc3VwZXJfX1xuIyAgICAgIGNvbnN0ciA9IGNvbnN0ci5fX3N1cGVyX18uY29uc3RydWN0b3JcbiMgICAgICBzaG91bGRFcnJvciA9IChjb25zdHIgIT0gdClcbiMgICAgaWYgc2hvdWxkRXJyb3JcbiMgICAgICB0aHJvdyBFcnJvciBcIlwiXCJcbiMgICAgICAgIFR5cGUgRXJyb3I6IGV4cGVjdGVkIHR5cGUgJyN7dC5uYW1lfScsXG4jICAgICAgICBnb3QgdHlwZSAje2NvbnN0ci5uYW1lfVxuIyAgICAgIFwiXCJcIlxuI1xuI2NoZWNrVHlwZU9mID0gKG9iaiwgdHlwZVN0cikgLT5cbiMgIGlmIHR5cGVvZiBvYmogIT0gdHlwZVN0clxuIyAgICB0aHJvdyBFcnJvciBcIlwiXCJcbiMgICAgICBUeXBlIEVycm9yOiBleHBlY3RlZCAodHlwZW9mKSAnI3t0eXBlU3RyfScsXG4jICAgICAgICBnb3QgdHlwZSAje3R5cGVvZiBvYmp9XG4jICAgIFwiXCJcIlxudHlwZSA9IChvYmplY3QsIGV4cGVjdGVkVHlwZSkgLT5cbiAgZXJyb3IgPSBmYWxzZVxuICBpZiBleHBlY3RlZFR5cGUgPT0gTnVtYmVyXG4gICAgZXJyb3IgPSAodHlwZW9mIG9iamVjdCAhPSAnbnVtYmVyJylcbiAgZWxzZSBpZiBleHBlY3RlZFR5cGUgPT0gU3RyaW5nXG4gICAgZXJyb3IgPSAodHlwZW9mIG9iamVjdCAhPSAnc3RyaW5nJylcbiAgZWxzZVxuICAgIGMgPSBvYmplY3QuY29uc3RydWN0b3JcbiAgICBlcnJvciA9IChjICE9IGV4cGVjdGVkVHlwZSlcbiAgICAjIFdhbGsgdXAgdGhlIGNsYXNzIGhpZXJhcmNoeVxuICAgIHdoaWxlIGVycm9yIGFuZCBjPy5fX3N1cGVyX19cbiAgICAgIGMgPSBjLl9fc3VwZXJfXy5jb25zdHJ1Y3RvclxuICAgICAgZXJyb3IgPSAoYyAhPSBleHBlY3RlZFR5cGUpXG4gICAgaWYgZXJyb3JcbiAgICAgIG1lc3NhZ2UgPSBcIkV4cGVkIHR5cGUgLCBnb3QgdHlwZSAnI3t0eXBlb2Ygb2JqZWN0fVwiXG4gIGlmIGVycm9yXG4gICAgdGhyb3cgRXJyb3IgJ1R5cGUgRXJyb3InXG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZVxuXG4gICMgICAgY29uc3RyID0gb2JqLmNvbnN0cnVjdG9yXG4gICMgICAgc2hvdWxkRXJyb3IgPSBjb25zdHIgIT0gdFxuICAjICAgIHdoaWxlIHNob3VsZEVycm9yIGFuZCBjb25zdHI/Ll9fc3VwZXJfX1xuICAjICAgICAgY29uc3RyID0gY29uc3RyLl9fc3VwZXJfXy5jb25zdHJ1Y3RvclxuICAjICAgICAgc2hvdWxkRXJyb3IgPSAoY29uc3RyICE9IHQpXG4iLCJ0eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmZpcnN0ID0gXy5maXJzdFxucmVzdCA9IF8ucmVzdFxudW5pb24gPSBfLnVuaW9uXG5cbmNsYXNzIFJlbGF0aW9uXG4gIGNvbnN0cnVjdG9yOiAoQGtleXMsIEBhdHRyaWJ1dGVzKSAtPlxuICBhdHRyaWJ1dGU6IChuYW1lKSAtPiBfLmZpbmRXaGVyZSBAYXR0cmlidXRlcywge25hbWV9XG4gIG46IC0+IEBhdHRyaWJ1dGVzLmxlbmd0aFxuICBtOiAtPiBAa2V5cy5sZW5ndGhcbiAgdG9DU1Y6IC0+XG4gICAgbmFtZXMgPSAoYXR0ci5uYW1lIGZvciBhdHRyIGluIEBhdHRyaWJ1dGVzKS5qb2luICcsJ1xuICAgIGxpbmUgPSAoa2V5KSA9PlxuICAgICAgKGF0dHIubWFwW2tleV0gZm9yIGF0dHIgaW4gQGF0dHJpYnV0ZXMpLmpvaW4gJywnXG4gICAgdHVwbGVzID0gKG1hcCBAa2V5cywgbGluZSkuam9pbiAnXFxuJ1xuICAgIG5hbWVzICsgJ1xcbicgKyB0dXBsZXNcblxuY2xhc3MgQXR0cmlidXRlXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsIEBrZXlzLCBAbWFwKSAtPlxuICB2YWx1ZXM6IC0+IEBtYXBba2V5XSBmb3Iga2V5IGluIEBrZXlzXG5SZWxhdGlvbi5BdHRyaWJ1dGUgPSBBdHRyaWJ1dGVcblxuUmVsYXRpb24uZnJvbUF0dHJpYnV0ZSA9IChhdHRyKSAtPlxuICBuZXcgUmVsYXRpb24gYXR0ci5rZXlzLCBbYXR0cl1cblxuUmVsYXRpb24uZnJvbVRhYmxlID0gKHRhYmxlKSAtPlxuICBuYW1lcyA9IGZpcnN0IHRhYmxlXG4gIHR1cGxlcyA9IHJlc3QgdGFibGVcblxuICBuID0gbmFtZXMubGVuZ3RoXG4gIG0gPSB0dXBsZXMubGVuZ3RoXG5cbiAga2V5cyA9IFswLi4ubV1cbiAgXG4gIGF0dHJpYnV0ZXMgPSBmb3IgaSBpbiBbMC4uLm5dXG4gICAgbmFtZSA9IG5hbWVzW2ldXG4gICAga2V5VmFsdWVNYXAgPSB7fVxuICAgIGZvciBrZXkgaW4ga2V5c1xuICAgICAgdHVwbGUgPSB0dXBsZXNba2V5XVxuICAgICAga2V5VmFsdWVNYXBba2V5XSA9IHBhcnNlRmxvYXQgdHVwbGVbaV1cbiAgICBuZXcgQXR0cmlidXRlIG5hbWUsIGtleXMsIGtleVZhbHVlTWFwXG5cbiAgbmV3IFJlbGF0aW9uIGtleXMsIGF0dHJpYnV0ZXNcblxuUmVsYXRpb24uY3Jvc3MgPSAoYSwgYikgLT5cbiAgdHlwZSBhLCBSZWxhdGlvblxuICB0eXBlIGIsIFJlbGF0aW9uXG4jIGFzc3VtZSBrZXkgc2V0IG1hdGNoZXMgYmV0d2VlbiBhIGFuZCBiXG4gIGtleXMgPSBhLmtleXNcbiAgYXR0cmlidXRlcyA9IHVuaW9uIGEuYXR0cmlidXRlcywgYi5hdHRyaWJ1dGVzXG4gIG5ldyBSZWxhdGlvbiBrZXlzLCBhdHRyaWJ1dGVzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWxhdGlvblxuIiwiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG50eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcblxuY2xhc3MgQVNUXG5cbmNsYXNzIFByb2dyYW0gZXh0ZW5kcyBBU1RcbiAgY29uc3RydWN0b3I6IChAc3RtdHMpIC0+XG5cbmNsYXNzIFN0bXQgZXh0ZW5kcyBBU1RcblxuY2xhc3MgU291cmNlIGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBjc3ZQYXRoKSAtPlxuICAgIHR5cGUgQGNzdlBhdGgsIFN0cmluZ1xuXG5jbGFzcyBEYXRhIGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLCBAZXhwcikgLT5cbiAgICB0eXBlIEBuYW1lLCBTdHJpbmdcbiAgICAjIHR5cGUgQGV4cHIgTmFtZSBvciBTdHJpbmdcblxuY2xhc3MgRm5TdG10IGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBsYWJlbCwgQGZuKSAtPlxuICAgIHR5cGUgQGxhYmVsLCBTdHJpbmdcbiAgICB0eXBlIEBmbiwgRm5cblxuRm5TdG10LmNyZWF0ZSA9IChsYWJlbCwgZm4pIC0+XG4gIHN3aXRjaCBsYWJlbFxuICAgIHdoZW4gJ1NDQUxFJyB0aGVuIG5ldyBTY2FsZSBsYWJlbCwgZm5cbiAgICB3aGVuICdDT09SRCcgdGhlbiBuZXcgQ29vcmQgbGFiZWwsIGZuXG4gICAgd2hlbiAnR1VJREUnIHRoZW4gbmV3IEd1aWRlIGxhYmVsLCBmblxuICAgIHdoZW4gJ0VMRU1FTlQnIHRoZW4gbmV3IEVsZW1lbnQgbGFiZWwsIGZuXG5cbmNsYXNzIFNjYWxlIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIENvb3JkIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIEd1aWRlIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBGblN0bXRcblxuY2xhc3MgRXhwciBleHRlbmRzIEFTVFxuXG5jbGFzcyBGbiBleHRlbmRzIEV4cHJcbiAgY29uc3RydWN0b3I6IChAbmFtZSwgQGFyZ3MpIC0+XG4gICAgdHlwZSBAbmFtZSwgU3RyaW5nXG4jIHR5cGUgQGFyZ3MsIEFycmF5PEV4cHI+XG5cbmNsYXNzIE9wIGV4dGVuZHMgRXhwclxuICBjb25zdHJ1Y3RvcjogKEBsZWZ0LCBAcmlnaHQsIEBzeW0pIC0+XG4gICAgdHlwZSBAbGVmdCwgTmFtZVxuICAgIHR5cGUgQHJpZ2h0LCBFeHByXG5cbk9wLmNyZWF0ZSA9IChsZWZ0LCByaWdodCwgc3ltKSAtPlxuICBzd2l0Y2ggc3ltXG4gICAgd2hlbiAnKicgdGhlbiBuZXcgQ3Jvc3MgbGVmdCwgcmlnaHQsIHN5bVxuICAgIHdoZW4gJysnIHRoZW4gbmV3IEJsZW5kIGxlZnQsIHJpZ2h0LCBzeW1cbiAgICB3aGVuICcvJyB0aGVuIG5ldyBOZXN0IGxlZnQsIHJpZ2h0LCBzeW1cblxuY2xhc3MgQ3Jvc3MgZXh0ZW5kcyBPcFxuXG5jbGFzcyBCbGVuZCBleHRlbmRzIE9wXG5cbmNsYXNzIE5lc3QgZXh0ZW5kcyBPcFxuXG5jbGFzcyBQcmltaXRpdmUgZXh0ZW5kcyBFeHByXG5cbmNsYXNzIE5hbWUgZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIFN0cmluZ1xuXG5jbGFzcyBTdHIgZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIFN0cmluZ1xuXG5jbGFzcyBOdW0gZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIE51bWJlclxuXG5fLmV4dGVuZCBBU1QsIHtcbiAgUHJvZ3JhbSwgU3RtdCwgRGF0YSwgU291cmNlLCBGblN0bXQsXG4gIFNjYWxlLCBDb29yZCwgR3VpZGUsIEVsZW1lbnQsXG4gIEV4cHIsIFByaW1pdGl2ZSwgTmFtZSwgU3RyLCBOdW0sIEZuLFxuICBPcCwgQ3Jvc3MsIEJsZW5kLCBOZXN0XG59XG5tb2R1bGUuZXhwb3J0cyA9IEFTVFxuIl19
;