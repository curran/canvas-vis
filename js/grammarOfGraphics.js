//@ sourceMappingURL=grammarOfGraphics.map
// Generated by CoffeeScript 1.6.1
(function() {

  define(['cv/grammarOfGraphics/parser', 'cv/match', 'cv/Varset', 'cv/Scale', 'cv/mark'], function(parser, match, Varset, Scale, mark) {
    var algebra, execute, extractScales, extractVarsets, renderer, show, variables, varsets;
    varsets = [];
    execute = function(columns, expression) {
      var keyToMark, keys, scale, scales, tree, vars, varset, _i, _len, _ref;
      tree = parser.parse(expression);
      vars = variables(tree, columns);
      tree = algebra(tree, vars);
      varsets = extractVarsets(tree);
      scales = extractScales(tree);
      if (varsets.length !== 1) {
        throw Error('Expected a single varset, got ' + varset.length);
      }
      varset = varsets[0];
      _ref = _.values(scales);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scale = _ref[_i];
        scale.init(varset);
      }
      keyToMark = renderer(tree);
      keys = varset.keys();
      return [keys, scales, keyToMark];
    };
    variables = function(tree, columns) {
      var stmt, vars, _i, _len, _ref;
      vars = _.extend({}, columns);
      _ref = tree.statements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stmt = _ref[_i];
        if (stmt.type === 'data') {
          vars[stmt.newName] = columns[stmt.oldName];
        }
      }
      return vars;
    };
    algebra = match('type', {
      'statements': function(stmts, vars) {
        var stmt;
        return {
          type: 'statements',
          statements: (function() {
            var _i, _len, _ref, _results;
            _ref = stmts.statements;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              stmt = _ref[_i];
              _results.push(algebra(stmt, vars));
            }
            return _results;
          })()
        };
      },
      'data': function(data, vars) {
        return data;
      },
      'statement': match('statementType', {
        ELEMENT: function(stmt, vars) {
          return {
            type: 'statement',
            statementType: 'ELEMENT',
            expr: algebra(stmt.expr, vars)
          };
        },
        TRANS: function(stmt, vars) {
          return stmt;
        },
        SCALE: function(stmt, vars) {
          return stmt;
        },
        COORD: function(stmt, vars) {
          return stmt;
        },
        GUIDE: function(stmt, vars) {
          return stmt;
        }
      }),
      'function': function(fn, vars) {
        var arg;
        return {
          type: 'function',
          name: fn.name,
          args: (function() {
            var _i, _len, _ref, _results;
            _ref = fn.args;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              _results.push(algebra(arg, vars));
            }
            return _results;
          })()
        };
      },
      'cross': function(cross, vars) {
        var left, right;
        left = algebra(cross.left, vars);
        right = algebra(cross.right, vars);
        return Varset.cross(left, right);
      },
      'name': function(name, vars) {
        return Varset.fromVariable(vars[name.name]);
      }
    });
    extractVarsets = match('type', {
      'statements': function(stmts) {
        var stmt;
        varsets = (function() {
          var _i, _len, _ref, _results;
          _ref = stmts.statements;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            stmt = _ref[_i];
            _results.push(extractVarsets(stmt));
          }
          return _results;
        })();
        return _.filter(_.flatten(varsets), _.identity);
      },
      'data': function(data) {},
      'statement': match('statementType', {
        ELEMENT: function(stmt) {
          return extractVarsets(stmt.expr);
        },
        TRANS: function(stmt) {},
        SCALE: function(stmt) {},
        COORD: function(stmt) {},
        GUIDE: function(stmt) {}
      }),
      'function': function(fn) {
        var arg, _i, _len, _ref, _results;
        _ref = fn.args;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          _results.push(extractVarsets(arg));
        }
        return _results;
      },
      'name': function(name) {},
      'varset': function(varset) {
        return varset;
      }
    });
    extractScales = match('type', {
      'statements': function(stmts) {
        var scale, scaleObjects, scales, stmt, _i, _len;
        scaleObjects = (function() {
          var _i, _len, _ref, _results;
          _ref = stmts.statements;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            stmt = _ref[_i];
            _results.push(extractScales(stmt));
          }
          return _results;
        })();
        scaleObjects = _.filter(scaleObjects, _.identity);
        scales = {};
        for (_i = 0, _len = scaleObjects.length; _i < _len; _i++) {
          scale = scaleObjects[_i];
          scales[scale.dim] = scale;
        }
        return scales;
      },
      'data': function(t) {},
      'statement': function(t) {
        if (t.statementType === 'SCALE') {
          return extractScales(t.expr);
        }
      },
      'function': match('name', {
        'linear': function(fn) {
          var dim;
          dim = fn.args[0].args[0].value;
          return new Scale(dim);
        }
      })
    });
    renderer = match('type', {
      'statements': function(stmts) {
        var renderers, stmt;
        renderers = (function() {
          var _i, _len, _ref, _results;
          _ref = stmts.statements;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            stmt = _ref[_i];
            _results.push(renderer(stmt));
          }
          return _results;
        })();
        renderers = _.filter(renderers, _.identity);
        return renderers[0];
      },
      'statement': function(t) {
        if (t.statementType === 'ELEMENT') {
          return renderer(t.expr);
        }
      },
      'data': function(t) {},
      'function': match('name', {
        'point': function(fn) {
          var arg, argFns;
          argFns = (function() {
            var _i, _len, _ref, _results;
            _ref = fn.args;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              arg = _ref[_i];
              _results.push(renderer(arg));
            }
            return _results;
          })();
          return function(key, scales) {
            var argFn, m, _i, _len;
            m = mark().shape('circle').size(0.03);
            for (_i = 0, _len = argFns.length; _i < _len; _i++) {
              argFn = argFns[_i];
              m = argFn(key, scales, m);
            }
            return m;
          };
        },
        'position': function(fn) {
          return function(key, scales, m) {
            var tuple, varset;
            varset = fn.args[0];
            tuple = varset.tuple(key);
            if (tuple.length < 2) {
              return m.x(scales[1].value(tuple)).y(0.5);
            } else {
              return m.x(scales[1].value(tuple)).y(scales[2].value(tuple));
            }
          };
        }
      })
    });
    show = match('type', {
      statements: function(t) {
        var s;
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = t.statements;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(show(s));
          }
          return _results;
        })()).join('\n');
      },
      statement: function(t) {
        return "" + t.statementType + ": " + (show(t.expr));
      },
      data: function(t) {
        return "DATA: " + t.newName + "=\"" + t.oldName + "\"";
      },
      name: function(t) {
        return t.name;
      },
      number: function(t) {
        return t.value;
      },
      string: function(t) {
        return t.value;
      },
      cross: function(t) {
        return "" + (show(t.left)) + "*" + (show(t.right));
      },
      assignment: function(t) {
        return "" + (show(t.left)) + "=" + (show(t.right));
      },
      "function": function(t) {
        var a;
        return "" + t.name + "(" + (((function() {
          var _i, _len, _ref, _results;
          _ref = t.args;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            a = _ref[_i];
            _results.push(show(a));
          }
          return _results;
        })()).join(',')) + ")";
      },
      varset: function(t) {
        return '<varset>';
      }
    });
    return {
      execute: execute,
      variables: variables,
      algebra: algebra,
      extractScales: extractScales,
      show: show
    };
  });

}).call(this);
