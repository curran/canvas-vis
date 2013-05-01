;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var Mark, evalExpressionBox, evaluate, evaluateAlgebra, genRenderFns, getFile, parse, preprocess, processCoordStmts, processDataStmts, processScaleStmts, processSourceStmts;

  (require('./tests.coffee'))();

  getFile = require('./getFile.coffee');

  parse = (require('./parser')).parse;

  processSourceStmts = require('./processSourceStmts.coffee');

  processDataStmts = require('./processDataStmts.coffee');

  evaluateAlgebra = require('./evaluateAlgebra.coffee');

  processScaleStmts = require('./processScaleStmts.coffee');

  processCoordStmts = require('./processCoordStmts.coffee');

  genRenderFns = require('./genRenderFns.coffee');

  Mark = require('./Mark.coffee');

  preprocess = function(expr) {};

  evaluate = function(expr, canvas) {
    var ast, ctx;

    ctx = canvas.getContext('2d');
    ast = parse(expr);
    return processSourceStmts(ast, function(err, vars) {
      var aesthetics, coords, geometry, key, keys, mark, renderFns, _i, _len, _ref, _results;

      vars = processDataStmts(ast, vars);
      ast = evaluateAlgebra(ast, vars);
      ast = processScaleStmts(ast);
      coords = processCoordStmts(ast);
      renderFns = genRenderFns(ast);
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

  getFile('gg/scatter.gg', function(err, expr) {
    expressionBox.value = expr;
    expressionBox.addEventListener('input', evalExpressionBox);
    return evalExpressionBox();
  });

  evalExpressionBox = function() {
    var error;

    try {
      errorDiv.innerHTML = '';
      return evaluate(expressionBox.value, canvas);
    } catch (_error) {
      error = _error;
      console.log('here');
      return errorDiv.innerHTML = error;
    }
  };

}).call(this);


},{"./tests.coffee":2,"./getFile.coffee":3,"./processSourceStmts.coffee":4,"./processDataStmts.coffee":5,"./evaluateAlgebra.coffee":6,"./processScaleStmts.coffee":7,"./processCoordStmts.coffee":8,"./genRenderFns.coffee":9,"./Mark.coffee":10,"./parser":11}],3:[function(require,module,exports){
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
  var Mark;

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

  module.exports = Mark;

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


},{"./show.coffee":12,"./parser.js":11}],11:[function(require,module,exports){
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

},{"./AST.coffee":13}],5:[function(require,module,exports){
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


},{"./match.coffee":14,"underscore":15}],6:[function(require,module,exports){
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


},{"./match.coffee":14,"./Relation.coffee":16,"./AST.coffee":13,"underscore":15}],7:[function(require,module,exports){
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
    var args, makeScale, name, scalesByDim, value, _i, _len, _ref, _ref1;

    scalesByDim = {};
    _ref = extractScaleStmts(ast);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      _ref1 = _ref[_i].fn, args = _ref1.args, name = _ref1.name;
      value = argsToOptions(args).dim.value;
      makeScale = scaleFactories[name];
      scalesByDim[value] = makeScale();
    }
    return scalesByDim;
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

  scaleFactories = {
    linear: function() {
      return new Scale;
    }
  };

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


},{"./match.coffee":14,"./type.coffee":17,"./Relation.coffee":16,"./Scale.coffee":18,"./AST.coffee":13,"./argsToOptions.coffee":19,"underscore":15}],8:[function(require,module,exports){
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


},{"./match.coffee":14,"./argsToOptions.coffee":19,"underscore":15}],9:[function(require,module,exports){
(function() {
  var Interval, Scale, aestheticsFns, argsToOptions, compact, extractElementStmts, extractKeys, first, genAestheticsFn, genGeometryFn, genRenderFns, geometryFns, map, match, _;

  match = require('./match.coffee');

  argsToOptions = require('./argsToOptions.coffee');

  Interval = require('./Interval.coffee');

  Scale = require('./Scale.coffee');

  _ = require('underscore');

  map = _.map;

  compact = _.compact;

  first = _.first;

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

  module.exports = genRenderFns;

}).call(this);


},{"./match.coffee":14,"./argsToOptions.coffee":19,"./Interval.coffee":20,"./Scale.coffee":18,"underscore":15}],4:[function(require,module,exports){
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


},{"./getFile.coffee":3,"./match.coffee":14,"./Relation.coffee":16,"underscore":15,"async":21}],15:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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


},{}],22:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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
},{"__browserify_process":22}],17:[function(require,module,exports){
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


},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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


},{"./type.coffee":17}],12:[function(require,module,exports){
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


},{"./match.coffee":14,"underscore":15}],16:[function(require,module,exports){
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


},{"./type.coffee":17,"underscore":15}],13:[function(require,module,exports){
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


},{"./type.coffee":17,"underscore":15}],18:[function(require,module,exports){
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


},{"./type.coffee":17,"./Relation.coffee":16,"./Interval.coffee":20,"underscore":15}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvbWFpbi5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvZ2V0RmlsZS5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvTWFyay5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvdGVzdHMuY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL3BhcnNlci5qcyIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9wcm9jZXNzRGF0YVN0bXRzLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9ldmFsdWF0ZUFsZ2VicmEuY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL3Byb2Nlc3NTY2FsZVN0bXRzLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9wcm9jZXNzQ29vcmRTdG10cy5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvZ2VuUmVuZGVyRm5zLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9wcm9jZXNzU291cmNlU3RtdHMuY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL21hdGNoLmNvZmZlZSIsIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9jdXJyYW4vbm9kZV9tb2R1bGVzL2FzeW5jL2xpYi9hc3luYy5qcyIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy90eXBlLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9hcmdzVG9PcHRpb25zLmNvZmZlZSIsIi9Vc2Vycy9jdXJyYW4vcmVwb3MvY2FudmFzLXZpcy9pZGVhcy9nZy9JbnRlcnZhbC5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvc2hvdy5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvUmVsYXRpb24uY29mZmVlIiwiL1VzZXJzL2N1cnJhbi9yZXBvcy9jYW52YXMtdmlzL2lkZWFzL2dnL0FTVC5jb2ZmZWUiLCIvVXNlcnMvY3VycmFuL3JlcG9zL2NhbnZhcy12aXMvaWRlYXMvZ2cvU2NhbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0E7Q0FBQSxLQUFBLGtLQUFBOztDQUFBLENBQUEsS0FBQyxTQUFBOztDQUFELENBRUEsQ0FBVSxJQUFWLFdBQVU7O0NBRlYsQ0FHQSxDQUFRLEVBQVIsRUFBUyxHQUFBOztDQUhULENBSUEsQ0FBcUIsSUFBQSxXQUFyQixXQUFxQjs7Q0FKckIsQ0FLQSxDQUFtQixJQUFBLFNBQW5CLFdBQW1COztDQUxuQixDQU1BLENBQWtCLElBQUEsUUFBbEIsV0FBa0I7O0NBTmxCLENBT0EsQ0FBb0IsSUFBQSxVQUFwQixXQUFvQjs7Q0FQcEIsQ0FRQSxDQUFvQixJQUFBLFVBQXBCLFdBQW9COztDQVJwQixDQVNBLENBQWUsSUFBQSxLQUFmLFdBQWU7O0NBVGYsQ0FVQSxDQUFPLENBQVAsR0FBTyxRQUFBOztDQVZQLENBWUEsQ0FBYSxDQUFBLEtBQUMsQ0FBZDs7Q0FaQSxDQWNBLENBQVcsQ0FBQSxFQUFBLEVBQVgsQ0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNzQ0E7Q0FBQSxDQUFBLENBQWlCLEdBQVgsQ0FBTixFQUFrQjtHQUNoQixNQUFDLEVBQUQ7Q0FDRSxTQUFBLEtBQUE7O0NBQUEsRUFBYyxHQUFkLEtBQUE7Q0FBQSxDQUNBLENBQUssQ0FBSSxFQUFULEtBQW9CO0FBQ2IsQ0FBUCxDQUFNLENBQU4sQ0FBYyxLQUFkLEVBQXlCLEVBQW5CO0NBQ0osRUFBYyxLQUFkLENBQW1DLEVBQW5DO0NBQUEsQ0FDQSxDQUFLLENBQUksSUFBVCxHQUFvQjtDQUp0QixNQUVBO0NBR0EsQ0FBQSxFQUFHLEVBQUg7Q0FDSyxDQUFELEVBQUYsQ0FBQSxJQUFBLE1BQUE7TUFERixFQUFBO0NBR0UsRUFBZ0MsQ0FBbkIsQ0FBUCxNQUFxQyxHQUFyQyxNQUFPO1FBVGpCO0NBRGUsSUFDZjtDQURGLEVBQWlCO0NBQWpCOzs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUEsRUFDUyxHQUFULEdBQWtCO0NBRGxCLENBRWtDLENBQWxDLENBQVUsRUFBVixFQUFVO0NBRlYsQ0FHdUIsQ0FBWixDQUFYLEVBQUEsRUFBVztDQUhYLEVBSVksR0FBWixHQUFBO0NBQXlCLENBQUosQ0FBRyxDQUFILEtBQXNCLE1BQXRCO0NBSnJCLE1BSVk7Q0FKWixFQU1PLENBQVAsRUFBQSxHQUFnQjtDQU5oQixFQU9PLENBQVAsRUFBQSxHQUFnQjtDQVBoQixDQUFBLENBUUEsR0FBQTtBQUNBLENBQUEsVUFBQSxnQ0FBQTt3QkFBQTtDQUNFLEVBQUksS0FBSixDQUFXO0NBRGIsTUFUQTtDQVdjLENBQU0sQ0FBaEIsQ0FBQSxLQUFBLElBQUE7Q0FaTixJQUFPOztDQUFQOztDQVRGOztDQUFBLENBdUJBLENBQWlCLEVBdkJqQixDQXVCTSxDQUFOO0NBdkJBIiwic291cmNlc0NvbnRlbnQiOlsiIyBSdW4gdW5pdCB0ZXN0cyBmb3IgcGFyc2VyXG4ocmVxdWlyZSAnLi90ZXN0cy5jb2ZmZWUnKSgpXG5cbmdldEZpbGUgPSByZXF1aXJlICcuL2dldEZpbGUuY29mZmVlJ1xucGFyc2UgPSAocmVxdWlyZSAnLi9wYXJzZXInKS5wYXJzZVxucHJvY2Vzc1NvdXJjZVN0bXRzID0gcmVxdWlyZSAnLi9wcm9jZXNzU291cmNlU3RtdHMuY29mZmVlJ1xucHJvY2Vzc0RhdGFTdG10cyA9IHJlcXVpcmUgJy4vcHJvY2Vzc0RhdGFTdG10cy5jb2ZmZWUnXG5ldmFsdWF0ZUFsZ2VicmEgPSByZXF1aXJlICcuL2V2YWx1YXRlQWxnZWJyYS5jb2ZmZWUnXG5wcm9jZXNzU2NhbGVTdG10cyA9IHJlcXVpcmUgJy4vcHJvY2Vzc1NjYWxlU3RtdHMuY29mZmVlJ1xucHJvY2Vzc0Nvb3JkU3RtdHMgPSByZXF1aXJlICcuL3Byb2Nlc3NDb29yZFN0bXRzLmNvZmZlZSdcbmdlblJlbmRlckZucyA9IHJlcXVpcmUgJy4vZ2VuUmVuZGVyRm5zLmNvZmZlZSdcbk1hcmsgPSByZXF1aXJlICcuL01hcmsuY29mZmVlJ1xuXG5wcmVwcm9jZXNzID0gKGV4cHIpIC0+XG5cbmV2YWx1YXRlID0gKGV4cHIsIGNhbnZhcykgLT5cbiAgI2NhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICNjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0ICcyZCdcblxuICBhc3QgPSBwYXJzZSBleHByXG4gIHByb2Nlc3NTb3VyY2VTdG10cyBhc3QsIChlcnIsIHZhcnMpIC0+XG4gICAgdmFycyA9IHByb2Nlc3NEYXRhU3RtdHMgYXN0LCB2YXJzXG4gICAgYXN0ID0gZXZhbHVhdGVBbGdlYnJhIGFzdCwgdmFyc1xuICAgIGFzdCA9IHByb2Nlc3NTY2FsZVN0bXRzIGFzdFxuI1RPRE8gdXNlIGNvb3Jkc1xuICAgIGNvb3JkcyA9IHByb2Nlc3NDb29yZFN0bXRzIGFzdFxuICAgIHJlbmRlckZucyA9IGdlblJlbmRlckZucyBhc3RcbiAgICBmb3Ige2tleXMsIGdlb21ldHJ5LCBhZXN0aGV0aWNzfSBpbiByZW5kZXJGbnNcbiAgICAgIGZvciBrZXkgaW4ga2V5c1xuICAgICAgICBtYXJrID0gTWFyaygpXG4gICAgICAgIG1hcmsgPSBnZW9tZXRyeSBrZXksIG1hcmtcbiMgVE9ETyAgbWFyayA9IGNvb3Jkcy5hcHBseSBtYXJrXG4gICAgICAgIG1hcmsgPSBhZXN0aGV0aWNzIGtleSwgbWFya1xuICAgICAgICBtYXJrLnJlbmRlciBjdHgsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodFxuXG4jIEV2YWx1YXRlIGEgR3JhbW1hciBvZiBHcmFwaGljcyBleHByZXNzaW9uIGZyb20gYSBmaWxlLlxuI2dldEZpbGUgJ2dnL3NjYXR0ZXIuZ2cnLCAoZXJyLCBleHByKSAtPiBldmFsdWF0ZSBleHByLCBjYW52YXNcbmdldEZpbGUgJ2dnL3NjYXR0ZXIuZ2cnLCAoZXJyLCBleHByKSAtPlxuICBleHByZXNzaW9uQm94LnZhbHVlID0gZXhwclxuICBleHByZXNzaW9uQm94LmFkZEV2ZW50TGlzdGVuZXIgJ2lucHV0JywgZXZhbEV4cHJlc3Npb25Cb3hcbiAgZXZhbEV4cHJlc3Npb25Cb3goKVxuXG5ldmFsRXhwcmVzc2lvbkJveCA9IC0+XG4gIHRyeVxuICAgIGVycm9yRGl2LmlubmVySFRNTCA9ICcnXG4gICAgZXZhbHVhdGUgZXhwcmVzc2lvbkJveC52YWx1ZSwgY2FudmFzXG4gIGNhdGNoIGVycm9yXG4gICAgY29uc29sZS5sb2cgJ2hlcmUnXG4gICAgZXJyb3JEaXYuaW5uZXJIVE1MID0gZXJyb3JcbiIsIiMgY2FsbGJhY2soZXJyLCB0ZXh0KVxuZ2V0RmlsZSA9IChwYXRoLCBjYWxsYmFjaykgLT5cbiAgIyBUT0RPIGhhbmRsZSBlcnJvciBjYXNlIGZvciBtaXNzaW5nIGZpbGVzXG4gICQuZ2V0IHBhdGgsICh0ZXh0KSAtPiBjYWxsYmFjayBudWxsLCB0ZXh0XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RmlsZVxuIiwiTWFyayA9IC0+XG4gICNUT0RPIHVzZSBzaW5nbGV0b24gc28gbm8gbmV3IG9iamVjdHMgYXJlIGNyZWF0ZWRcbiAgeDogKEBfeCkgLT4gQFxuICB5OiAoQF95KSAtPiBAXG4gIF9zaXplOiAwLjAxXG4gIHNpemU6IChAX3NpemUpIC0+IEBcbiAgcmVuZGVyOiAoY3R4LCB3LCBoKSAtPlxuICAgICNUT0RPIHVzZSBWaWV3cG9ydCBhYnN0cmFjdGlvblxuICAgIHggPSBAX3ggKiB3XG4gICAgeSA9IEBfeSAqIGhcbiAgICByYWRpdXMgPSBAX3NpemUgKiAodyArIGgpIC8gNFxuICAgIGN0eC5iZWdpblBhdGgoKVxuICAgIGN0eC5hcmMgeCwgeSwgcmFkaXVzLCAwLCAyKk1hdGguUElcbiAgICBjdHguY2xvc2VQYXRoKClcbiAgICBjdHguZmlsbCgpXG5cbm1vZHVsZS5leHBvcnRzID0gTWFya1xuIiwiIyBUZXN0cyBmb3IgdGhlIHBhcnNlclxucGFyc2UgPSAocmVxdWlyZSAnLi9wYXJzZXIuanMnKS5wYXJzZVxuc2hvdyA9IHJlcXVpcmUgJy4vc2hvdy5jb2ZmZWUnXG5cbnRlc3RzID0gLT5cbiAgY2hlY2sgJ0RBVEE6IHggPSB5J1xuICBjaGVjayBcIlwiXCJcbiAgICBEQVRBOiB4ID0geVxuICAgIERBVEE6IHEgPSB6XG4gIFwiXCJcIlxuICBjaGVjayAnREFUQTogeCA9IFwic2VwYWwgbGVuZ3RoXCInXG4gIGNoZWNrICdTT1VSQ0U6IFwiZGF0YS9pcmlzLmNzdlwiJ1xuICBjaGVjayAnRUxFTUVOVDogcG9pbnQocG9zaXRpb24oeCp5KSknXG4gIGNoZWNrICdFTEVNRU5UOiBwb2ludChwb3NpdGlvbih4K3kpKSdcbiAgY2hlY2sgJ0VMRU1FTlQ6IHBvaW50KHBvc2l0aW9uKHgveSkpJ1xuICBjaGVjayBcIlwiXCJcbiAgICBTT1VSQ0U6IFwiZGF0YS9pcmlzLmNzdlwiXG4gICAgREFUQTogeCA9IFwicGV0YWwgbGVuZ3RoXCJcbiAgICBEQVRBOiB5ID0gXCJzZXBhbCBsZW5ndGhcIlxuICAgIFNDQUxFOiBsaW5lYXIoZGltKDEpKVxuICAgIFNDQUxFOiBsaW5lYXIoZGltKDIpKVxuICAgIENPT1JEOiByZWN0KGRpbSgxLCAyKSlcbiAgICBHVUlERTogYXhpcyhkaW0oMSkpXG4gICAgR1VJREU6IGF4aXMoZGltKDIpKVxuICAgIEVMRU1FTlQ6IHBvaW50KHBvc2l0aW9uKHgqeSkpXG4gIFwiXCJcIlxuICBjb25zb2xlLmxvZyAnQWxsIHRlc3RzIHBhc3NlZCEnXG5cbmNoZWNrID0gKGV4cHIpIC0+IGFzc2VydEVxIChzaG93IHBhcnNlIGV4cHIpLCBleHByXG5cbmFzc2VydEVxID0gKGFjdHVhbCwgZXhwZWN0ZWQpIC0+IGlmIGFjdHVhbCAhPSBleHBlY3RlZFxuICB0aHJvdyBuZXcgRXJyb3IgXCJFeHBlY3RlZCAnI3tleHBlY3RlZH0nLCBnb3QgJyN7YWN0dWFsfSdcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHRlc3RzXG4iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpe1xuICAvKlxuICAgKiBHZW5lcmF0ZWQgYnkgUEVHLmpzIDAuNy4wLlxuICAgKlxuICAgKiBodHRwOi8vcGVnanMubWFqZGEuY3ovXG4gICAqL1xuICBcbiAgZnVuY3Rpb24gcXVvdGUocykge1xuICAgIC8qXG4gICAgICogRUNNQS0yNjIsIDV0aCBlZC4sIDcuOC40OiBBbGwgY2hhcmFjdGVycyBtYXkgYXBwZWFyIGxpdGVyYWxseSBpbiBhXG4gICAgICogc3RyaW5nIGxpdGVyYWwgZXhjZXB0IGZvciB0aGUgY2xvc2luZyBxdW90ZSBjaGFyYWN0ZXIsIGJhY2tzbGFzaCxcbiAgICAgKiBjYXJyaWFnZSByZXR1cm4sIGxpbmUgc2VwYXJhdG9yLCBwYXJhZ3JhcGggc2VwYXJhdG9yLCBhbmQgbGluZSBmZWVkLlxuICAgICAqIEFueSBjaGFyYWN0ZXIgbWF5IGFwcGVhciBpbiB0aGUgZm9ybSBvZiBhbiBlc2NhcGUgc2VxdWVuY2UuXG4gICAgICpcbiAgICAgKiBGb3IgcG9ydGFiaWxpdHksIHdlIGFsc28gZXNjYXBlIGVzY2FwZSBhbGwgY29udHJvbCBhbmQgbm9uLUFTQ0lJXG4gICAgICogY2hhcmFjdGVycy4gTm90ZSB0aGF0IFwiXFwwXCIgYW5kIFwiXFx2XCIgZXNjYXBlIHNlcXVlbmNlcyBhcmUgbm90IHVzZWRcbiAgICAgKiBiZWNhdXNlIEpTSGludCBkb2VzIG5vdCBsaWtlIHRoZSBmaXJzdCBhbmQgSUUgdGhlIHNlY29uZC5cbiAgICAgKi9cbiAgICAgcmV0dXJuICdcIicgKyBzXG4gICAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSAgLy8gYmFja3NsYXNoXG4gICAgICAucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICAgIC8vIGNsb3NpbmcgcXVvdGUgY2hhcmFjdGVyXG4gICAgICAucmVwbGFjZSgvXFx4MDgvZywgJ1xcXFxiJykgLy8gYmFja3NwYWNlXG4gICAgICAucmVwbGFjZSgvXFx0L2csICdcXFxcdCcpICAgLy8gaG9yaXpvbnRhbCB0YWJcbiAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJykgICAvLyBsaW5lIGZlZWRcbiAgICAgIC5yZXBsYWNlKC9cXGYvZywgJ1xcXFxmJykgICAvLyBmb3JtIGZlZWRcbiAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJykgICAvLyBjYXJyaWFnZSByZXR1cm5cbiAgICAgIC5yZXBsYWNlKC9bXFx4MDAtXFx4MDdcXHgwQlxceDBFLVxceDFGXFx4ODAtXFx1RkZGRl0vZywgZXNjYXBlKVxuICAgICAgKyAnXCInO1xuICB9XG4gIFxuICB2YXIgcmVzdWx0ID0ge1xuICAgIC8qXG4gICAgICogUGFyc2VzIHRoZSBpbnB1dCB3aXRoIGEgZ2VuZXJhdGVkIHBhcnNlci4gSWYgdGhlIHBhcnNpbmcgaXMgc3VjY2Vzc2Z1bGwsXG4gICAgICogcmV0dXJucyBhIHZhbHVlIGV4cGxpY2l0bHkgb3IgaW1wbGljaXRseSBzcGVjaWZpZWQgYnkgdGhlIGdyYW1tYXIgZnJvbVxuICAgICAqIHdoaWNoIHRoZSBwYXJzZXIgd2FzIGdlbmVyYXRlZCAoc2VlIHxQRUcuYnVpbGRQYXJzZXJ8KS4gSWYgdGhlIHBhcnNpbmcgaXNcbiAgICAgKiB1bnN1Y2Nlc3NmdWwsIHRocm93cyB8UEVHLnBhcnNlci5TeW50YXhFcnJvcnwgZGVzY3JpYmluZyB0aGUgZXJyb3IuXG4gICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uKGlucHV0LCBzdGFydFJ1bGUpIHtcbiAgICAgIHZhciBwYXJzZUZ1bmN0aW9ucyA9IHtcbiAgICAgICAgXCJzdGFydFwiOiBwYXJzZV9zdGFydCxcbiAgICAgICAgXCJzdG10XCI6IHBhcnNlX3N0bXQsXG4gICAgICAgIFwiZGF0YVwiOiBwYXJzZV9kYXRhLFxuICAgICAgICBcInNvdXJjZVwiOiBwYXJzZV9zb3VyY2UsXG4gICAgICAgIFwiZm5TdG10XCI6IHBhcnNlX2ZuU3RtdCxcbiAgICAgICAgXCJleHByXCI6IHBhcnNlX2V4cHIsXG4gICAgICAgIFwiZm5cIjogcGFyc2VfZm4sXG4gICAgICAgIFwiYXJnc1wiOiBwYXJzZV9hcmdzLFxuICAgICAgICBcImFyZ1wiOiBwYXJzZV9hcmcsXG4gICAgICAgIFwib3BcIjogcGFyc2Vfb3AsXG4gICAgICAgIFwicHJpbWl0aXZlXCI6IHBhcnNlX3ByaW1pdGl2ZSxcbiAgICAgICAgXCJuYW1lXCI6IHBhcnNlX25hbWUsXG4gICAgICAgIFwic3RyXCI6IHBhcnNlX3N0cixcbiAgICAgICAgXCJudW1cIjogcGFyc2VfbnVtLFxuICAgICAgICBcIndzXCI6IHBhcnNlX3dzXG4gICAgICB9O1xuICAgICAgXG4gICAgICBpZiAoc3RhcnRSdWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHBhcnNlRnVuY3Rpb25zW3N0YXJ0UnVsZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcnVsZSBuYW1lOiBcIiArIHF1b3RlKHN0YXJ0UnVsZSkgKyBcIi5cIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0UnVsZSA9IFwic3RhcnRcIjtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdmFyIHBvcyA9IDA7XG4gICAgICB2YXIgcmVwb3J0RmFpbHVyZXMgPSAwO1xuICAgICAgdmFyIHJpZ2h0bW9zdEZhaWx1cmVzUG9zID0gMDtcbiAgICAgIHZhciByaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkID0gW107XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhZExlZnQoaW5wdXQsIHBhZGRpbmcsIGxlbmd0aCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gaW5wdXQ7XG4gICAgICAgIFxuICAgICAgICB2YXIgcGFkTGVuZ3RoID0gbGVuZ3RoIC0gaW5wdXQubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcGFkZGluZyArIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gZXNjYXBlKGNoKSB7XG4gICAgICAgIHZhciBjaGFyQ29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIHZhciBlc2NhcGVDaGFyO1xuICAgICAgICB2YXIgbGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNoYXJDb2RlIDw9IDB4RkYpIHtcbiAgICAgICAgICBlc2NhcGVDaGFyID0gJ3gnO1xuICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXNjYXBlQ2hhciA9ICd1JztcbiAgICAgICAgICBsZW5ndGggPSA0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlQ2hhciArIHBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCksICcwJywgbGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gbWF0Y2hGYWlsZWQoZmFpbHVyZSkge1xuICAgICAgICBpZiAocG9zIDwgcmlnaHRtb3N0RmFpbHVyZXNQb3MpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChwb3MgPiByaWdodG1vc3RGYWlsdXJlc1Bvcykge1xuICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzUG9zID0gcG9zO1xuICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzRXhwZWN0ZWQgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmlnaHRtb3N0RmFpbHVyZXNFeHBlY3RlZC5wdXNoKGZhaWx1cmUpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9zdGFydCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDE7XG4gICAgICAgIHZhciBwb3MwO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcmVzdWx0MSA9IHBhcnNlX3N0bXQoKTtcbiAgICAgICAgaWYgKHJlc3VsdDEgIT09IG51bGwpIHtcbiAgICAgICAgICByZXN1bHQwID0gW107XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDAucHVzaChyZXN1bHQxKTtcbiAgICAgICAgICAgIHJlc3VsdDEgPSBwYXJzZV9zdG10KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIHN0bXRzKSB7IHJldHVybiBuZXcgUHJvZ3JhbShzdG10cyk7IH0pKHBvczAsIHJlc3VsdDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2Vfc3RtdCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDA7XG4gICAgICAgIFxuICAgICAgICByZXN1bHQwID0gcGFyc2VfZGF0YSgpO1xuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBwYXJzZV9zb3VyY2UoKTtcbiAgICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MCA9IHBhcnNlX2ZuU3RtdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2VfZGF0YSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDQsIHJlc3VsdDUsIHJlc3VsdDYsIHJlc3VsdDcsIHJlc3VsdDg7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwb3MsIDUpID09PSBcIkRBVEE6XCIpIHtcbiAgICAgICAgICByZXN1bHQwID0gXCJEQVRBOlwiO1xuICAgICAgICAgIHBvcyArPSA1O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiREFUQTpcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBbXTtcbiAgICAgICAgICByZXN1bHQyID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MS5wdXNoKHJlc3VsdDIpO1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQyID0gcGFyc2VfbmFtZSgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IFtdO1xuICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQzLnB1c2gocmVzdWx0NCk7XG4gICAgICAgICAgICAgICAgcmVzdWx0NCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA2MSkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0NCA9IFwiPVwiO1xuICAgICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIj1cXFwiXCIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0NCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0NSA9IFtdO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0NiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0NiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQ1LnB1c2gocmVzdWx0Nik7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdDYgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdDUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0NiA9IHBhcnNlX25hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdDYgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ2ID0gcGFyc2Vfc3RyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdDYgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ3ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDcucHVzaChyZXN1bHQ4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdDggPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0NyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IFtyZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzLCByZXN1bHQ0LCByZXN1bHQ1LCByZXN1bHQ2LCByZXN1bHQ3XTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIGxlZnQsIGV4cHIpIHsgcmV0dXJuIG5ldyBEYXRhKGxlZnQudmFsdWUsIGV4cHIpOyB9KShwb3MwLCByZXN1bHQwWzJdLCByZXN1bHQwWzZdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX3NvdXJjZSgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDQ7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwb3MsIDcpID09PSBcIlNPVVJDRTpcIikge1xuICAgICAgICAgIHJlc3VsdDAgPSBcIlNPVVJDRTpcIjtcbiAgICAgICAgICBwb3MgKz0gNztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIlNPVVJDRTpcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBbXTtcbiAgICAgICAgICByZXN1bHQyID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MS5wdXNoKHJlc3VsdDIpO1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQyID0gcGFyc2Vfc3RyKCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQzID0gW107XG4gICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0NCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDMucHVzaChyZXN1bHQ0KTtcbiAgICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0M107XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBjc3ZQYXRoKSB7IHJldHVybiBuZXcgU291cmNlKGNzdlBhdGgudmFsdWUpOyB9KShwb3MwLCByZXN1bHQwWzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX2ZuU3RtdCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDMsIHJlc3VsdDQsIHJlc3VsdDU7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwb3MsIDUpID09PSBcIlNDQUxFXCIpIHtcbiAgICAgICAgICByZXN1bHQwID0gXCJTQ0FMRVwiO1xuICAgICAgICAgIHBvcyArPSA1O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiU0NBTEVcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA1KSA9PT0gXCJDT09SRFwiKSB7XG4gICAgICAgICAgICByZXN1bHQwID0gXCJDT09SRFwiO1xuICAgICAgICAgICAgcG9zICs9IDU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIkNPT1JEXFxcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5zdWJzdHIocG9zLCA1KSA9PT0gXCJHVUlERVwiKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBcIkdVSURFXCI7XG4gICAgICAgICAgICAgIHBvcyArPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIkdVSURFXFxcIlwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKGlucHV0LnN1YnN0cihwb3MsIDcpID09PSBcIkVMRU1FTlRcIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBcIkVMRU1FTlRcIjtcbiAgICAgICAgICAgICAgICBwb3MgKz0gNztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIkVMRU1FTlRcXFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDU4KSB7XG4gICAgICAgICAgICByZXN1bHQxID0gXCI6XCI7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiOlxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQyID0gW107XG4gICAgICAgICAgICByZXN1bHQzID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgIHdoaWxlIChyZXN1bHQzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIucHVzaChyZXN1bHQzKTtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQzID0gcGFyc2VfZm4oKTtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdDMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQ0ID0gW107XG4gICAgICAgICAgICAgICAgcmVzdWx0NSA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHJlc3VsdDUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDQucHVzaChyZXN1bHQ1KTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDUgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0NCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IFtyZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzLCByZXN1bHQ0XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIGxhYmVsLCBmbikgeyByZXR1cm4gRm5TdG10LmNyZWF0ZShsYWJlbCwgZm4pOyB9KShwb3MwLCByZXN1bHQwWzBdLCByZXN1bHQwWzNdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX2V4cHIoKSB7XG4gICAgICAgIHZhciByZXN1bHQwO1xuICAgICAgICBcbiAgICAgICAgcmVzdWx0MCA9IHBhcnNlX2ZuKCk7XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IHBhcnNlX29wKCk7XG4gICAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBwYXJzZV9wcmltaXRpdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX2ZuKCkge1xuICAgICAgICB2YXIgcmVzdWx0MCwgcmVzdWx0MTtcbiAgICAgICAgdmFyIHBvczAsIHBvczE7XG4gICAgICAgIFxuICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICBwb3MxID0gcG9zO1xuICAgICAgICBpZiAoL15bYS16XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICByZXN1bHQxID0gaW5wdXQuY2hhckF0KHBvcyk7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlthLXpdXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MSA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDQ2KSB7XG4gICAgICAgICAgICByZXN1bHQxID0gXCIuXCI7XG4gICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiLlxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwLnB1c2gocmVzdWx0MSk7XG4gICAgICAgICAgICBpZiAoL15bYS16XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlthLXpdXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0Nikge1xuICAgICAgICAgICAgICAgIHJlc3VsdDEgPSBcIi5cIjtcbiAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIi5cXFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBwYXJzZV9hcmdzKCk7XG4gICAgICAgICAgaWYgKHJlc3VsdDEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBuYW1lLCBhcmdzKSB7IHJldHVybiBuZXcgRm4obmFtZS5qb2luKCcnKSwgYXJncyk7fSkocG9zMCwgcmVzdWx0MFswXSwgcmVzdWx0MFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9hcmdzKCkge1xuICAgICAgICB2YXIgcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NDtcbiAgICAgICAgdmFyIHBvczAsIHBvczE7XG4gICAgICAgIFxuICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICBwb3MxID0gcG9zO1xuICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0MCkge1xuICAgICAgICAgIHJlc3VsdDAgPSBcIihcIjtcbiAgICAgICAgICBwb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIihcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBbXTtcbiAgICAgICAgICByZXN1bHQyID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MS5wdXNoKHJlc3VsdDIpO1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQyID0gW107XG4gICAgICAgICAgICByZXN1bHQzID0gcGFyc2VfYXJnKCk7XG4gICAgICAgICAgICB3aGlsZSAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQyLnB1c2gocmVzdWx0Myk7XG4gICAgICAgICAgICAgIHJlc3VsdDMgPSBwYXJzZV9hcmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDMgPSBbXTtcbiAgICAgICAgICAgICAgcmVzdWx0NCA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIHdoaWxlIChyZXN1bHQ0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0My5wdXNoKHJlc3VsdDQpO1xuICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gNDEpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBcIilcIjtcbiAgICAgICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQ0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCIpXFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBhcmdzKSB7IHJldHVybiBhcmdzOyB9KShwb3MwLCByZXN1bHQwWzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX2FyZygpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDIsIHJlc3VsdDM7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcmVzdWx0MCA9IHBhcnNlX2V4cHIoKTtcbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICAgIHBvczEgPSBwb3M7XG4gICAgICAgICAgcmVzdWx0MCA9IFtdO1xuICAgICAgICAgIHJlc3VsdDEgPSBwYXJzZV93cygpO1xuICAgICAgICAgIHdoaWxlIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwLnB1c2gocmVzdWx0MSk7XG4gICAgICAgICAgICByZXN1bHQxID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdDAgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDQ0KSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBcIixcIjtcbiAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiLFxcXCJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIgPSBbXTtcbiAgICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgICAgIHdoaWxlIChyZXN1bHQzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0Mi5wdXNoKHJlc3VsdDMpO1xuICAgICAgICAgICAgICAgIHJlc3VsdDMgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MyA9IHBhcnNlX2V4cHIoKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IFtyZXN1bHQwLCByZXN1bHQxLCByZXN1bHQyLCByZXN1bHQzXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIGV4cHIpIHsgcmV0dXJuIGV4cHI7IH0pKHBvczAsIHJlc3VsdDBbM10pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX29wKCkge1xuICAgICAgICB2YXIgcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NDtcbiAgICAgICAgdmFyIHBvczAsIHBvczE7XG4gICAgICAgIFxuICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICBwb3MxID0gcG9zO1xuICAgICAgICByZXN1bHQwID0gcGFyc2VfbmFtZSgpO1xuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDEgPSBbXTtcbiAgICAgICAgICByZXN1bHQyID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICB3aGlsZSAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmVzdWx0MS5wdXNoKHJlc3VsdDIpO1xuICAgICAgICAgICAgcmVzdWx0MiA9IHBhcnNlX3dzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0Mikge1xuICAgICAgICAgICAgICByZXN1bHQyID0gXCIqXCI7XG4gICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MiA9IG51bGw7XG4gICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIipcXFwiXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSA0Mykge1xuICAgICAgICAgICAgICAgIHJlc3VsdDIgPSBcIitcIjtcbiAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQyID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIitcXFwiXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0MiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDQ3KSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQyID0gXCIvXCI7XG4gICAgICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0MiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hGYWlsZWQoXCJcXFwiL1xcXCJcIik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXN1bHQzID0gW107XG4gICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV93cygpO1xuICAgICAgICAgICAgICB3aGlsZSAocmVzdWx0NCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDMucHVzaChyZXN1bHQ0KTtcbiAgICAgICAgICAgICAgICByZXN1bHQ0ID0gcGFyc2Vfd3MoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocmVzdWx0MyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdDQgPSBwYXJzZV9leHByKCk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdDQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0MiwgcmVzdWx0MywgcmVzdWx0NF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICAgIHBvcyA9IHBvczE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBsZWZ0LCBzeW0sIHJpZ2h0KSB7IHJldHVybiBPcC5jcmVhdGUobGVmdCwgcmlnaHQsIHN5bSk7IH0pKHBvczAsIHJlc3VsdDBbMF0sIHJlc3VsdDBbMl0sIHJlc3VsdDBbNF0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcG9zID0gcG9zMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0MDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gcGFyc2VfcHJpbWl0aXZlKCkge1xuICAgICAgICB2YXIgcmVzdWx0MDtcbiAgICAgICAgXG4gICAgICAgIHJlc3VsdDAgPSBwYXJzZV9uYW1lKCk7XG4gICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IHBhcnNlX3N0cigpO1xuICAgICAgICAgIGlmIChyZXN1bHQwID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwID0gcGFyc2VfbnVtKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9uYW1lKCkge1xuICAgICAgICB2YXIgcmVzdWx0MCwgcmVzdWx0MTtcbiAgICAgICAgdmFyIHBvczA7XG4gICAgICAgIFxuICAgICAgICBwb3MwID0gcG9zO1xuICAgICAgICBpZiAoL15bYS16XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICByZXN1bHQxID0gaW5wdXQuY2hhckF0KHBvcyk7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlthLXpdXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MSA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmICgvXltBLVpdLy50ZXN0KGlucHV0LmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiW0EtWl1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwLnB1c2gocmVzdWx0MSk7XG4gICAgICAgICAgICBpZiAoL15bYS16XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlthLXpdXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzdWx0MSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoL15bQS1aXS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQxID0gaW5wdXQuY2hhckF0KHBvcyk7XG4gICAgICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0MSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIltBLVpdXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCAhPT0gbnVsbCkge1xuICAgICAgICAgIHJlc3VsdDAgPSAoZnVuY3Rpb24ob2Zmc2V0LCBjaGFycykgeyByZXR1cm4gbmV3IE5hbWUoY2hhcnMuam9pbignJykpOyB9KShwb3MwLCByZXN1bHQwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIHBvcyA9IHBvczA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDA7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIHBhcnNlX3N0cigpIHtcbiAgICAgICAgdmFyIHJlc3VsdDAsIHJlc3VsdDEsIHJlc3VsdDI7XG4gICAgICAgIHZhciBwb3MwLCBwb3MxO1xuICAgICAgICBcbiAgICAgICAgcG9zMCA9IHBvcztcbiAgICAgICAgcG9zMSA9IHBvcztcbiAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gMzQpIHtcbiAgICAgICAgICByZXN1bHQwID0gXCJcXFwiXCI7XG4gICAgICAgICAgcG9zKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJcXFxcXFxcIlxcXCJcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MSA9IFtdO1xuICAgICAgICAgIGlmICgvXlteXCJdLy50ZXN0KGlucHV0LmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgICAgcmVzdWx0MiA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgcG9zKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdDIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHJlcG9ydEZhaWx1cmVzID09PSAwKSB7XG4gICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiW15cXFwiXVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2hpbGUgKHJlc3VsdDIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdDEucHVzaChyZXN1bHQyKTtcbiAgICAgICAgICAgIGlmICgvXlteXCJdLy50ZXN0KGlucHV0LmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgICAgICByZXN1bHQyID0gaW5wdXQuY2hhckF0KHBvcyk7XG4gICAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0MiA9IG51bGw7XG4gICAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiW15cXFwiXVwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0MSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGlucHV0LmNoYXJDb2RlQXQocG9zKSA9PT0gMzQpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MiA9IFwiXFxcIlwiO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDIgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJcXFxcXFxcIlxcXCJcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXN1bHQyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlc3VsdDAgPSBbcmVzdWx0MCwgcmVzdWx0MSwgcmVzdWx0Ml07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgICAgcG9zID0gcG9zMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0MCA9IG51bGw7XG4gICAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBwb3MgPSBwb3MxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIGNoYXJzKSB7IHJldHVybiBuZXcgU3RyKGNoYXJzLmpvaW4oJycpKTsgfSkocG9zMCwgcmVzdWx0MFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV9udW0oKSB7XG4gICAgICAgIHZhciByZXN1bHQwLCByZXN1bHQxO1xuICAgICAgICB2YXIgcG9zMDtcbiAgICAgICAgXG4gICAgICAgIHBvczAgPSBwb3M7XG4gICAgICAgIGlmICgvXlswLTldLy50ZXN0KGlucHV0LmNoYXJBdChwb3MpKSkge1xuICAgICAgICAgIHJlc3VsdDEgPSBpbnB1dC5jaGFyQXQocG9zKTtcbiAgICAgICAgICBwb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQxID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiWzAtOV1cIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IFtdO1xuICAgICAgICAgIHdoaWxlIChyZXN1bHQxICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXN1bHQwLnB1c2gocmVzdWx0MSk7XG4gICAgICAgICAgICBpZiAoL15bMC05XS8udGVzdChpbnB1dC5jaGFyQXQocG9zKSkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0MSA9IGlucHV0LmNoYXJBdChwb3MpO1xuICAgICAgICAgICAgICBwb3MrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdDEgPSBudWxsO1xuICAgICAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlswLTldXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdDAgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQwICE9PSBudWxsKSB7XG4gICAgICAgICAgcmVzdWx0MCA9IChmdW5jdGlvbihvZmZzZXQsIGNoYXJzKSB7IHJldHVybiBuZXcgTnVtKHBhcnNlRmxvYXQoY2hhcnMuam9pbignJykpKTsgfSkocG9zMCwgcmVzdWx0MCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdDAgPT09IG51bGwpIHtcbiAgICAgICAgICBwb3MgPSBwb3MwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBwYXJzZV93cygpIHtcbiAgICAgICAgdmFyIHJlc3VsdDA7XG4gICAgICAgIFxuICAgICAgICBpZiAoaW5wdXQuY2hhckNvZGVBdChwb3MpID09PSAzMikge1xuICAgICAgICAgIHJlc3VsdDAgPSBcIiBcIjtcbiAgICAgICAgICBwb3MrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICBpZiAocmVwb3J0RmFpbHVyZXMgPT09IDApIHtcbiAgICAgICAgICAgIG1hdGNoRmFpbGVkKFwiXFxcIiBcXFwiXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0MCA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChpbnB1dC5jaGFyQ29kZUF0KHBvcykgPT09IDEwKSB7XG4gICAgICAgICAgICByZXN1bHQwID0gXCJcXG5cIjtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQwID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChyZXBvcnRGYWlsdXJlcyA9PT0gMCkge1xuICAgICAgICAgICAgICBtYXRjaEZhaWxlZChcIlxcXCJcXFxcblxcXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQwO1xuICAgICAgfVxuICAgICAgXG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGNsZWFudXBFeHBlY3RlZChleHBlY3RlZCkge1xuICAgICAgICBleHBlY3RlZC5zb3J0KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgbGFzdEV4cGVjdGVkID0gbnVsbDtcbiAgICAgICAgdmFyIGNsZWFuRXhwZWN0ZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBleHBlY3RlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChleHBlY3RlZFtpXSAhPT0gbGFzdEV4cGVjdGVkKSB7XG4gICAgICAgICAgICBjbGVhbkV4cGVjdGVkLnB1c2goZXhwZWN0ZWRbaV0pO1xuICAgICAgICAgICAgbGFzdEV4cGVjdGVkID0gZXhwZWN0ZWRbaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjbGVhbkV4cGVjdGVkO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBjb21wdXRlRXJyb3JQb3NpdGlvbigpIHtcbiAgICAgICAgLypcbiAgICAgICAgICogVGhlIGZpcnN0IGlkZWEgd2FzIHRvIHVzZSB8U3RyaW5nLnNwbGl0fCB0byBicmVhayB0aGUgaW5wdXQgdXAgdG8gdGhlXG4gICAgICAgICAqIGVycm9yIHBvc2l0aW9uIGFsb25nIG5ld2xpbmVzIGFuZCBkZXJpdmUgdGhlIGxpbmUgYW5kIGNvbHVtbiBmcm9tXG4gICAgICAgICAqIHRoZXJlLiBIb3dldmVyIElFJ3MgfHNwbGl0fCBpbXBsZW1lbnRhdGlvbiBpcyBzbyBicm9rZW4gdGhhdCBpdCB3YXNcbiAgICAgICAgICogZW5vdWdoIHRvIHByZXZlbnQgaXQuXG4gICAgICAgICAqL1xuICAgICAgICBcbiAgICAgICAgdmFyIGxpbmUgPSAxO1xuICAgICAgICB2YXIgY29sdW1uID0gMTtcbiAgICAgICAgdmFyIHNlZW5DUiA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLm1heChwb3MsIHJpZ2h0bW9zdEZhaWx1cmVzUG9zKTsgaSsrKSB7XG4gICAgICAgICAgdmFyIGNoID0gaW5wdXQuY2hhckF0KGkpO1xuICAgICAgICAgIGlmIChjaCA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgaWYgKCFzZWVuQ1IpIHsgbGluZSsrOyB9XG4gICAgICAgICAgICBjb2x1bW4gPSAxO1xuICAgICAgICAgICAgc2VlbkNSID0gZmFsc2U7XG4gICAgICAgICAgfSBlbHNlIGlmIChjaCA9PT0gXCJcXHJcIiB8fCBjaCA9PT0gXCJcXHUyMDI4XCIgfHwgY2ggPT09IFwiXFx1MjAyOVwiKSB7XG4gICAgICAgICAgICBsaW5lKys7XG4gICAgICAgICAgICBjb2x1bW4gPSAxO1xuICAgICAgICAgICAgc2VlbkNSID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sdW1uKys7XG4gICAgICAgICAgICBzZWVuQ1IgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7IGxpbmU6IGxpbmUsIGNvbHVtbjogY29sdW1uIH07XG4gICAgICB9XG4gICAgICBcbiAgICAgIFxuICAgICAgICAvLyBJbXBvcnQgQVNUIHR5cGVzIGZvciBidWlsZGluZyB0aGUgQWJzdHJhY3QgU3ludGF4IFRyZWUuXG4gICAgICAgIHZhciBBU1QgPSByZXF1aXJlKCcuL0FTVC5jb2ZmZWUnKTtcbiAgICAgICAgdmFyIFByb2dyYW0gPSBBU1QuUHJvZ3JhbTtcbiAgICAgICAgdmFyIERhdGEgPSBBU1QuRGF0YTtcbiAgICAgICAgdmFyIFNvdXJjZSA9IEFTVC5Tb3VyY2U7XG4gICAgICAgIHZhciBGblN0bXQgPSBBU1QuRm5TdG10O1xuICAgICAgICB2YXIgU2NhbGUgPSBBU1QuU2NhbGU7XG4gICAgICAgIHZhciBDb29yZCA9IEFTVC5Db29yZDtcbiAgICAgICAgdmFyIEd1aWRlID0gQVNULkd1aWRlO1xuICAgICAgICB2YXIgRWxlbWVudCA9IEFTVC5FbGVtZW50O1xuICAgICAgICB2YXIgRm4gPSBBU1QuRm47XG4gICAgICAgIHZhciBPcCA9IEFTVC5PcDtcbiAgICAgICAgdmFyIE5hbWUgPSBBU1QuTmFtZTtcbiAgICAgICAgdmFyIFN0ciA9IEFTVC5TdHI7XG4gICAgICAgIHZhciBOdW0gPSBBU1QuTnVtO1xuICAgICAgXG4gICAgICBcbiAgICAgIHZhciByZXN1bHQgPSBwYXJzZUZ1bmN0aW9uc1tzdGFydFJ1bGVdKCk7XG4gICAgICBcbiAgICAgIC8qXG4gICAgICAgKiBUaGUgcGFyc2VyIGlzIG5vdyBpbiBvbmUgb2YgdGhlIGZvbGxvd2luZyB0aHJlZSBzdGF0ZXM6XG4gICAgICAgKlxuICAgICAgICogMS4gVGhlIHBhcnNlciBzdWNjZXNzZnVsbHkgcGFyc2VkIHRoZSB3aG9sZSBpbnB1dC5cbiAgICAgICAqXG4gICAgICAgKiAgICAtIHxyZXN1bHQgIT09IG51bGx8XG4gICAgICAgKiAgICAtIHxwb3MgPT09IGlucHV0Lmxlbmd0aHxcbiAgICAgICAqICAgIC0gfHJpZ2h0bW9zdEZhaWx1cmVzRXhwZWN0ZWR8IG1heSBvciBtYXkgbm90IGNvbnRhaW4gc29tZXRoaW5nXG4gICAgICAgKlxuICAgICAgICogMi4gVGhlIHBhcnNlciBzdWNjZXNzZnVsbHkgcGFyc2VkIG9ubHkgYSBwYXJ0IG9mIHRoZSBpbnB1dC5cbiAgICAgICAqXG4gICAgICAgKiAgICAtIHxyZXN1bHQgIT09IG51bGx8XG4gICAgICAgKiAgICAtIHxwb3MgPCBpbnB1dC5sZW5ndGh8XG4gICAgICAgKiAgICAtIHxyaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkfCBtYXkgb3IgbWF5IG5vdCBjb250YWluIHNvbWV0aGluZ1xuICAgICAgICpcbiAgICAgICAqIDMuIFRoZSBwYXJzZXIgZGlkIG5vdCBzdWNjZXNzZnVsbHkgcGFyc2UgYW55IHBhcnQgb2YgdGhlIGlucHV0LlxuICAgICAgICpcbiAgICAgICAqICAgLSB8cmVzdWx0ID09PSBudWxsfFxuICAgICAgICogICAtIHxwb3MgPT09IDB8XG4gICAgICAgKiAgIC0gfHJpZ2h0bW9zdEZhaWx1cmVzRXhwZWN0ZWR8IGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBmYWlsdXJlXG4gICAgICAgKlxuICAgICAgICogQWxsIGNvZGUgZm9sbG93aW5nIHRoaXMgY29tbWVudCAoaW5jbHVkaW5nIGNhbGxlZCBmdW5jdGlvbnMpIG11c3RcbiAgICAgICAqIGhhbmRsZSB0aGVzZSBzdGF0ZXMuXG4gICAgICAgKi9cbiAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgcG9zICE9PSBpbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IE1hdGgubWF4KHBvcywgcmlnaHRtb3N0RmFpbHVyZXNQb3MpO1xuICAgICAgICB2YXIgZm91bmQgPSBvZmZzZXQgPCBpbnB1dC5sZW5ndGggPyBpbnB1dC5jaGFyQXQob2Zmc2V0KSA6IG51bGw7XG4gICAgICAgIHZhciBlcnJvclBvc2l0aW9uID0gY29tcHV0ZUVycm9yUG9zaXRpb24oKTtcbiAgICAgICAgXG4gICAgICAgIHRocm93IG5ldyB0aGlzLlN5bnRheEVycm9yKFxuICAgICAgICAgIGNsZWFudXBFeHBlY3RlZChyaWdodG1vc3RGYWlsdXJlc0V4cGVjdGVkKSxcbiAgICAgICAgICBmb3VuZCxcbiAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgZXJyb3JQb3NpdGlvbi5saW5lLFxuICAgICAgICAgIGVycm9yUG9zaXRpb24uY29sdW1uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgICBcbiAgICAvKiBSZXR1cm5zIHRoZSBwYXJzZXIgc291cmNlIGNvZGUuICovXG4gICAgdG9Tb3VyY2U6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fc291cmNlOyB9XG4gIH07XG4gIFxuICAvKiBUaHJvd24gd2hlbiBhIHBhcnNlciBlbmNvdW50ZXJzIGEgc3ludGF4IGVycm9yLiAqL1xuICBcbiAgcmVzdWx0LlN5bnRheEVycm9yID0gZnVuY3Rpb24oZXhwZWN0ZWQsIGZvdW5kLCBvZmZzZXQsIGxpbmUsIGNvbHVtbikge1xuICAgIGZ1bmN0aW9uIGJ1aWxkTWVzc2FnZShleHBlY3RlZCwgZm91bmQpIHtcbiAgICAgIHZhciBleHBlY3RlZEh1bWFuaXplZCwgZm91bmRIdW1hbml6ZWQ7XG4gICAgICBcbiAgICAgIHN3aXRjaCAoZXhwZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBleHBlY3RlZEh1bWFuaXplZCA9IFwiZW5kIG9mIGlucHV0XCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBleHBlY3RlZEh1bWFuaXplZCA9IGV4cGVjdGVkWzBdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGV4cGVjdGVkSHVtYW5pemVkID0gZXhwZWN0ZWQuc2xpY2UoMCwgZXhwZWN0ZWQubGVuZ3RoIC0gMSkuam9pbihcIiwgXCIpXG4gICAgICAgICAgICArIFwiIG9yIFwiXG4gICAgICAgICAgICArIGV4cGVjdGVkW2V4cGVjdGVkLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmb3VuZEh1bWFuaXplZCA9IGZvdW5kID8gcXVvdGUoZm91bmQpIDogXCJlbmQgb2YgaW5wdXRcIjtcbiAgICAgIFxuICAgICAgcmV0dXJuIFwiRXhwZWN0ZWQgXCIgKyBleHBlY3RlZEh1bWFuaXplZCArIFwiIGJ1dCBcIiArIGZvdW5kSHVtYW5pemVkICsgXCIgZm91bmQuXCI7XG4gICAgfVxuICAgIFxuICAgIHRoaXMubmFtZSA9IFwiU3ludGF4RXJyb3JcIjtcbiAgICB0aGlzLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gICAgdGhpcy5mb3VuZCA9IGZvdW5kO1xuICAgIHRoaXMubWVzc2FnZSA9IGJ1aWxkTWVzc2FnZShleHBlY3RlZCwgZm91bmQpO1xuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIHRoaXMubGluZSA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gIH07XG4gIFxuICByZXN1bHQuU3ludGF4RXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuICBcbiAgcmV0dXJuIHJlc3VsdDtcbn0pKCk7XG4iLCJtYXRjaCA9IHJlcXVpcmUgJy4vbWF0Y2guY29mZmVlJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5tYXAgPSBfLm1hcFxuY29tcGFjdCA9IF8uY29tcGFjdFxuXG5wcm9jZXNzRGF0YVN0bXRzID0gKGFzdCwgdmFycykgLT5cbiAgZGF0YVN0bXRzID0gZXh0cmFjdERhdGFTdG10cyBhc3RcbiAgZm9yIGRhdGFTdG10IGluIGRhdGFTdG10c1xuICAgIG5ld05hbWUgPSBkYXRhU3RtdC5uYW1lXG4gICAgb2xkTmFtZSA9IGRhdGFTdG10LmV4cHIudmFsdWVcbiAgICB2YXJzW25ld05hbWVdID0gdmFyc1tvbGROYW1lXVxuICByZXR1cm4gdmFyc1xuXG5leHRyYWN0RGF0YVN0bXRzID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+XG4gICAgY29tcGFjdCBtYXAgc3RtdHMsIGV4dHJhY3REYXRhU3RtdHNcbiAgRGF0YTogKGQpIC0+IGRcbiAgQVNUOiAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3NEYXRhU3RtdHNcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5SZWxhdGlvbiA9IHJlcXVpcmUgJy4vUmVsYXRpb24uY29mZmVlJ1xuQVNUID0gcmVxdWlyZSAnLi9BU1QuY29mZmVlJ1xuUHJvZ3JhbSA9IEFTVC5Qcm9ncmFtXG5FbGVtZW50ID0gQVNULkVsZW1lbnRcbkZuID0gQVNULkZuXG5Dcm9zcyA9IEFTVC5Dcm9zc1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5tYXAgPSBfLm1hcFxuY29tcGFjdCA9IF8uY29tcGFjdFxuXG4jIGV2YWx1YXRlQWxnZWJyYShhc3QsIHZhcnMpIC0+IGFzdFxuIyB3aGVyZSBPcCBleHByZXNzaW9ucyBhcmUgcmVwbGFjZWQgYnkgUmVsYXRpb25zXG5cbmV2YWx1YXRlQWxnZWJyYSA9IChhc3QsIHZhcnMpIC0+XG4gIGFsZ2VicmEgPSBtYXRjaFxuICAgIFByb2dyYW06ICh7c3RtdHN9KSAtPiBuZXcgUHJvZ3JhbSBtYXAgc3RtdHMsIGFsZ2VicmFcbiAgICBFbGVtZW50OiAoe2ZufSkgLT4gbmV3IEVsZW1lbnQgJ0VMRU1FTlQnLCBhbGdlYnJhIGZuXG4gICAgRm46ICh7bmFtZSwgYXJnc30pIC0+IG5ldyBGbiBuYW1lLCBtYXAgYXJncywgYWxnZWJyYVxuICAgIENyb3NzOiAoe2xlZnQsIHJpZ2h0LCBzeW19KSAtPlxuICAgICAgUmVsYXRpb24uY3Jvc3MgKGFsZ2VicmEgbGVmdCksIChhbGdlYnJhIHJpZ2h0KVxuICAgIE5hbWU6ICh7dmFsdWV9KSAtPiBSZWxhdGlvbi5mcm9tQXR0cmlidXRlIHZhcnNbdmFsdWVdXG4gICAgQVNUOiAoYXN0KSAtPiBhc3RcbiAgYWxnZWJyYSBhc3RcblxuXG4jIFRPRE8gcmVuYW1lIGZpbGUgdG8gYWxnZWJyYS5jb2ZmZWVcbm1vZHVsZS5leHBvcnRzID0gZXZhbHVhdGVBbGdlYnJhXG4iLCJtYXRjaCA9IHJlcXVpcmUgJy4vbWF0Y2guY29mZmVlJ1xudHlwZSA9IHJlcXVpcmUgJy4vdHlwZS5jb2ZmZWUnXG5SZWxhdGlvbiA9IHJlcXVpcmUgJy4vUmVsYXRpb24uY29mZmVlJ1xuU2NhbGUgPSByZXF1aXJlICcuL1NjYWxlLmNvZmZlZSdcbkFTVCA9IHJlcXVpcmUgJy4vQVNULmNvZmZlZSdcblByb2dyYW0gPSBBU1QuUHJvZ3JhbVxuRWxlbWVudCA9IEFTVC5FbGVtZW50XG5GbiA9IEFTVC5GblxuYXJnc1RvT3B0aW9ucyA9IHJlcXVpcmUgJy4vYXJnc1RvT3B0aW9ucy5jb2ZmZWUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5cbnByb2Nlc3NTY2FsZVN0bXRzID0gKGFzdCkgLT5cbiAgc2NhbGVzQnlEaW0gPSBleHRyYWN0U2NhbGVzQnlEaW0gYXN0XG4gIHNjYWxlcyA9IG1hdGNoXG4gICAgUHJvZ3JhbTogKHtzdG10c30pIC0+IG5ldyBQcm9ncmFtIG1hcCBzdG10cywgc2NhbGVzXG4jVE9ETyBtYWtlIHRoZSBsYWJlbCBhcmd1bWVudCBvcHRpb25hbCwgcmV2ZXJzZSBvcmRlclxuIyBpdCdzIHN0dXBpZCB0byBwYXNzIGluICdFTEVNRU5UJyB0byBuZXcgRWxlbWVudCgpXG4gICAgRWxlbWVudDogKHtmbn0pIC0+IG5ldyBFbGVtZW50ICdFTEVNRU5UJywgc2NhbGVzIGZuXG4gICAgRm46ICh7bmFtZSwgYXJnc30pIC0+IG5ldyBGbiBuYW1lLCBtYXAgYXJncywgc2NhbGVzXG4gICAgUmVsYXRpb246IChyZWxhdGlvbikgLT4gYXBwbHlTY2FsZXMgcmVsYXRpb24sIHNjYWxlc0J5RGltXG4gICAgQVNUOiAoYXN0KSAtPiBhc3RcbiAgcmV0dXJuIHNjYWxlcyBhc3RcblxuZXh0cmFjdFNjYWxlc0J5RGltID0gKGFzdCkgLT5cbiAgc2NhbGVzQnlEaW0gPSB7fVxuICBmb3Ige2ZuOnthcmdzLCBuYW1lfX0gaW4gKGV4dHJhY3RTY2FsZVN0bXRzIGFzdClcbiAgICB7ZGltOnt2YWx1ZX19ID0gYXJnc1RvT3B0aW9ucyBhcmdzXG4gICAgbWFrZVNjYWxlID0gc2NhbGVGYWN0b3JpZXNbbmFtZV1cbiAgICBzY2FsZXNCeURpbVt2YWx1ZV0gPSBtYWtlU2NhbGUoKVxuICByZXR1cm4gc2NhbGVzQnlEaW1cblxuZXh0cmFjdFNjYWxlU3RtdHMgPSBtYXRjaFxuICBQcm9ncmFtOiAoe3N0bXRzfSkgLT5cbiAgICBjb21wYWN0IG1hcCBzdG10cywgZXh0cmFjdFNjYWxlU3RtdHNcbiAgU2NhbGU6IChzKSAtPiBzXG4gIEFTVDogLT5cblxuc2NhbGVGYWN0b3JpZXMgPVxuICBsaW5lYXI6IC0+IG5ldyBTY2FsZVxuXG5hcHBseVNjYWxlcyA9IChyZWxhdGlvbiwgc2NhbGVzQnlEaW0pIC0+XG4gIGtleXMgPSByZWxhdGlvbi5rZXlzXG4gIGF0dHJpYnV0ZXMgPSBmb3IgZGltIGluIFsxLi5yZWxhdGlvbi5hdHRyaWJ1dGVzLmxlbmd0aF1cbiAgICBhdHRyaWJ1dGUgPSByZWxhdGlvbi5hdHRyaWJ1dGVzW2RpbS0xXVxuICAgIGlmIHNjYWxlc0J5RGltW2RpbV1cbiAgICAgIHNjYWxlc0J5RGltW2RpbV0uYXBwbHkgYXR0cmlidXRlXG4gICAgZWxzZVxuICAgICAgYXR0cmlidXRlXG4gIG5ldyBSZWxhdGlvbiBrZXlzLCBhdHRyaWJ1dGVzXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvY2Vzc1NjYWxlU3RtdHNcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5hcmdzVG9PcHRpb25zID0gcmVxdWlyZSAnLi9hcmdzVG9PcHRpb25zLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmNvbXBhY3QgPSBfLmNvbXBhY3RcblxucHJvY2Vzc0Nvb3JkU3RtdHMgPSAoYXN0KSAtPlxuICBjb29yZFN0bXRzID0gZXh0cmFjdENvb3JkU3RtdHMgYXN0XG4gIGlmIGNvb3JkU3RtdHMubGVuZ3RoICE9IDFcbiAgICB0aHJvdyBFcnJvciBcIkV4YWN0bHkgMSBDT09SRCBzdGF0ZW1lbnQgZXhwZWN0ZWQsIGdvdCAje2Nvb3JkU3RtdHMubGVuZ3RofVwiXG4gIHtmbn0gPSBjb29yZFN0bXRzWzBdXG4gIHtkaW19ID0gYXJnc1RvT3B0aW9ucyBmbi5hcmdzXG4gIG1ha2VDb29yZGluYXRlcyA9IGNvb3JkRmFjdG9yaWVzW2ZuLm5hbWVdXG4gIG1ha2VDb29yZGluYXRlcyhkaW0pXG5cbmV4dHJhY3RDb29yZFN0bXRzID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+XG4gICAgY29tcGFjdCBtYXAgc3RtdHMsIGV4dHJhY3RDb29yZFN0bXRzXG4gIENvb3JkOiAoYykgLT4gY1xuICBBU1Q6IC0+XG5cbmNvb3JkRmFjdG9yaWVzID1cbiAgcmVjdDogKGRpbSkgLT4gbmV3IENvb3JkaW5hdGVTcGFjZVxuXG5jbGFzcyBDb29yZGluYXRlU3BhY2VcblxubW9kdWxlLmV4cG9ydHMgPSBwcm9jZXNzQ29vcmRTdG10c1xuIiwibWF0Y2ggPSByZXF1aXJlICcuL21hdGNoLmNvZmZlZSdcbmFyZ3NUb09wdGlvbnMgPSByZXF1aXJlICcuL2FyZ3NUb09wdGlvbnMuY29mZmVlJ1xuSW50ZXJ2YWwgPSByZXF1aXJlICcuL0ludGVydmFsLmNvZmZlZSdcblNjYWxlID0gcmVxdWlyZSAnLi9TY2FsZS5jb2ZmZWUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5maXJzdCA9IF8uZmlyc3RcblxuZ2VuUmVuZGVyRm5zID0gKGFzdCkgLT5cbiAgZWxlbWVudFN0bXRzID0gZXh0cmFjdEVsZW1lbnRTdG10cyBhc3RcbiAgbWFwIGVsZW1lbnRTdG10cywgKHtmbn0pIC0+XG4gICAgb3B0aW9ucyA9IGFyZ3NUb09wdGlvbnMgZm4uYXJnc1xuICAgIGtleXM6IGV4dHJhY3RLZXlzIGZuXG4gICAgZ2VvbWV0cnk6IGdlbkdlb21ldHJ5Rm4gZm4ubmFtZSwgb3B0aW9uc1xuICAgIGFlc3RoZXRpY3M6IGdlbkFlc3RoZXRpY3NGbiBmbi5uYW1lLCBvcHRpb25zXG5cbmV4dHJhY3RFbGVtZW50U3RtdHMgPSBtYXRjaFxuICBQcm9ncmFtOiAoe3N0bXRzfSkgLT5cbiAgICBjb21wYWN0IG1hcCBzdG10cywgZXh0cmFjdEVsZW1lbnRTdG10c1xuICBFbGVtZW50OiAoZSkgLT4gZVxuICBBU1Q6IC0+XG5cbmV4dHJhY3RLZXlzID0gbWF0Y2hcbiAgRm46ICh7bmFtZSwgYXJnc30pIC0+XG4gICAgZmlyc3QgbWFwIGFyZ3MsIGV4dHJhY3RLZXlzXG4gIFJlbGF0aW9uOiAocmVsYXRpb24pIC0+IHJlbGF0aW9uLmtleXNcbiAgQVNUOiAtPlxuXG5nZW5HZW9tZXRyeUZuID0gKGZuTmFtZSwgb3B0aW9ucykgLT5cbiAgZ2VvbWV0cnlGbnNbZm5OYW1lXSBvcHRpb25zXG5cbmdlb21ldHJ5Rm5zID1cbiAgcG9pbnQ6IChvcHRpb25zKSAtPlxuICAgIGlmIG9wdGlvbnMucG9zaXRpb25cbiAgICAgIHJlbGF0aW9uID0gb3B0aW9ucy5wb3NpdGlvblxuICAgICAgYXR0cnMgPSByZWxhdGlvbi5hdHRyaWJ1dGVzXG4gICAgICAoa2V5LCBtYXJrKSAtPlxuICAgICAgICBpZiBhdHRycy5sZW5ndGggPT0gMVxuICAgICAgICAgIG1hcmsueChyZWxhdGlvbi5hdHRyaWJ1dGVzWzBdLm1hcFtrZXldKVxuICAgICAgICAgICAgICAueSgwLjUpXG4gICAgICAgIGVsc2UgaWYgYXR0cnMubGVuZ3RoID09IDJcbiAgICAgICAgICBtYXJrLngocmVsYXRpb24uYXR0cmlidXRlc1swXS5tYXBba2V5XSlcbiAgICAgICAgICAgICAgLnkocmVsYXRpb24uYXR0cmlidXRlc1sxXS5tYXBba2V5XSlcbiAgICBlbHNlIChrZXksIG1hcmspIC0+IG1hcmtcblxuZ2VuQWVzdGhldGljc0ZuID0gKGZuTmFtZSwgb3B0aW9ucykgLT5cbiAgYWVzdGhldGljc0Zuc1tmbk5hbWVdIG9wdGlvbnNcblxuYWVzdGhldGljc0ZucyA9XG4gIHBvaW50OiAoe3NpemV9KSAtPlxuICAgIGlmIHNpemVcbiAgICAgIG1pblNpemUgPSAwLjAxXG4gICAgICBtYXhTaXplID0gMC4wNVxuICAgICAgdW5pdCA9IG5ldyBJbnRlcnZhbCAwLCAxXG4gICAgICBzaXplcyA9IG5ldyBJbnRlcnZhbCBtaW5TaXplLCBtYXhTaXplXG4gICAgICBzY2FsZSA9IG5ldyBTY2FsZVxuIyAgICAgIHNjYWxlLmRlc3QubWluID0gMC4xXG4jICAgICAgc2NhbGUuZGVzdC5tYXggPSAwLjFcbiAgICAgIGF0dHIgPSBzaXplLmF0dHJpYnV0ZXNbMF1cbiAgICAgIGF0dHIgPSBzY2FsZS5hcHBseSBhdHRyXG4gICAgICAoa2V5LCBtYXJrKSAtPlxuICAgICAgICB2YWwgPSBhdHRyLm1hcFtrZXldXG4gICAgICAgIG1hcmsuc2l6ZSB1bml0LnRvIHNpemVzLCB2YWxcbiAgICBlbHNlIChrZXksIG1hcmspIC0+IG1hcmtcblxubW9kdWxlLmV4cG9ydHMgPSBnZW5SZW5kZXJGbnMgXG4iLCJtYXRjaCA9IHJlcXVpcmUgJy4vbWF0Y2guY29mZmVlJ1xuZ2V0RmlsZSA9IHJlcXVpcmUgJy4vZ2V0RmlsZS5jb2ZmZWUnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZSdcbm1hcCA9IF8ubWFwXG5jb21wYWN0ID0gXy5jb21wYWN0XG5hc3luYyA9IHJlcXVpcmUgJ2FzeW5jJ1xuUmVsYXRpb24gPSByZXF1aXJlICcuL1JlbGF0aW9uLmNvZmZlZSdcblxuIyBUaGlzIGZ1bmN0aW9uIGlzIGFzeW5jaHJvbm91cyBiZWNhdXNlIGl0IGdyYWJzIENTViBmaWxlcyBmcm9tIFVSTHNcbiMgY2FsbGJhY2soZXJyLCB2YXJzOk1hcDxTdHJpbmcsIFJlbGF0aW9uLkF0dHJpYnV0ZT4pXG5wcm9jZXNzU291cmNlU3RtdHMgPSAoYXN0LCBjYWxsYmFjaykgLT5cbiAgc291cmNlcyA9IGV4dHJhY3RTb3VyY2VzIGFzdFxuICBnZXRSZWxhdGlvbnMgc291cmNlcywgKGVyciwgcmVsYXRpb25zKSAtPlxuICAgIHZhcnMgPSB7fVxuICAgIGZvciByZWxhdGlvbiBpbiByZWxhdGlvbnNcbiAgICAgIGZvciBhdHRyIGluIHJlbGF0aW9uLmF0dHJpYnV0ZXNcbiAgICAgICAgdmFyc1thdHRyLm5hbWVdID0gYXR0clxuICAgIGNhbGxiYWNrIG51bGwsIHZhcnNcblxuI1RPRE8gcmVuYW1lIHRvIGV4dHJhY3RTb3VyY2VTdG10c1xuZXh0cmFjdFNvdXJjZXMgPSBtYXRjaFxuICBQcm9ncmFtOiAoe3N0bXRzfSkgLT5cbiAgICBjb21wYWN0IG1hcCBzdG10cywgZXh0cmFjdFNvdXJjZXNcbiAgU291cmNlOiAocykgLT4gc1xuICBBU1Q6IC0+XG5cbiMgY2FsbGJhY2soZXJyLCBbW25hbWU6U3RyaW5nLCBSZWxhdGlvbl1dKVxuZ2V0UmVsYXRpb25zID0gKHNvdXJjZXMsIGNhbGxiYWNrKSAtPlxuICBhc3luYy5tYXAgc291cmNlcywgZ2V0UmVsYXRpb24sIGNhbGxiYWNrXG5cbiMgY2FsbGJhY2soZXJyLCBbbmFtZTpTdHJpbmcsIFJlbGF0aW9uXSlcbmdldFJlbGF0aW9uID0gKHNvdXJjZSwgY2FsbGJhY2spIC0+XG4gIGdldEZpbGUgc291cmNlLmNzdlBhdGgsIChlcnIsIGNzdlRleHQpIC0+XG4gICAgaWYgZXJyIHRoZW4gY2FsbGJhY2sgZXJyXG4gICAgdGFibGUgPSAkLmNzdi50b0FycmF5cyBjc3ZUZXh0XG4gICAgcmVsYXRpb24gPSBSZWxhdGlvbi5mcm9tVGFibGUgdGFibGVcbiAgICBjYWxsYmFjayBudWxsLCByZWxhdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb2Nlc3NTb3VyY2VTdG10c1xuIiwiKGZ1bmN0aW9uKCl7Ly8gICAgIFVuZGVyc2NvcmUuanMgMS40LjRcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIEluYy5cbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGdsb2JhbGAgb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSBvYmplY3QgdGhhdCBnZXRzIHJldHVybmVkIHRvIGJyZWFrIG91dCBvZiBhIGxvb3AgaXRlcmF0aW9uLlxuICB2YXIgYnJlYWtlciA9IHt9O1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUZvckVhY2ggICAgICA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICBuYXRpdmVNYXAgICAgICAgICAgPSBBcnJheVByb3RvLm1hcCxcbiAgICBuYXRpdmVSZWR1Y2UgICAgICAgPSBBcnJheVByb3RvLnJlZHVjZSxcbiAgICBuYXRpdmVSZWR1Y2VSaWdodCAgPSBBcnJheVByb3RvLnJlZHVjZVJpZ2h0LFxuICAgIG5hdGl2ZUZpbHRlciAgICAgICA9IEFycmF5UHJvdG8uZmlsdGVyLFxuICAgIG5hdGl2ZUV2ZXJ5ICAgICAgICA9IEFycmF5UHJvdG8uZXZlcnksXG4gICAgbmF0aXZlU29tZSAgICAgICAgID0gQXJyYXlQcm90by5zb21lLFxuICAgIG5hdGl2ZUluZGV4T2YgICAgICA9IEFycmF5UHJvdG8uaW5kZXhPZixcbiAgICBuYXRpdmVMYXN0SW5kZXhPZiAgPSBBcnJheVByb3RvLmxhc3RJbmRleE9mLFxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQ7XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0IHZpYSBhIHN0cmluZyBpZGVudGlmaWVyLFxuICAvLyBmb3IgQ2xvc3VyZSBDb21waWxlciBcImFkdmFuY2VkXCIgbW9kZS5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS40LjQnO1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgb2JqZWN0cyB3aXRoIHRoZSBidWlsdC1pbiBgZm9yRWFjaGAsIGFycmF5cywgYW5kIHJhdyBvYmplY3RzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZm9yRWFjaGAgaWYgYXZhaWxhYmxlLlxuICB2YXIgZWFjaCA9IF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybjtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoXy5oYXMob2JqLCBrZXkpKSB7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgYW55KG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmaWx0ZXJgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzW3Jlc3VsdHMubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgfSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBldmVyeWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChuYXRpdmVFdmVyeSAmJiBvYmouZXZlcnkgPT09IG5hdGl2ZUV2ZXJ5KSByZXR1cm4gb2JqLmV2ZXJ5KGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIShyZXN1bHQgPSByZXN1bHQgJiYgaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocmVzdWx0IHx8IChyZXN1bHQgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgdGFyZ2V0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgb2JqLmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBvYmouaW5kZXhPZih0YXJnZXQpICE9IC0xO1xuICAgIHJldHVybiBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB0YXJnZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAoaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKXsgcmV0dXJuIHZhbHVlW2tleV07IH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMsIGZpcnN0KSB7XG4gICAgaWYgKF8uaXNFbXB0eShhdHRycykpIHJldHVybiBmaXJzdCA/IG51bGwgOiBbXTtcbiAgICByZXR1cm4gX1tmaXJzdCA/ICdmaW5kJyA6ICdmaWx0ZXInXShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzW2tleV0gIT09IHZhbHVlW2tleV0pIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8ud2hlcmUob2JqLCBhdHRycywgdHJ1ZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWU6IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5N1xuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heC5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNFbXB0eShvYmopKSByZXR1cm4gLUluZmluaXR5O1xuICAgIHZhciByZXN1bHQgPSB7Y29tcHV0ZWQgOiAtSW5maW5pdHksIHZhbHVlOiAtSW5maW5pdHl9O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBjb21wdXRlZCA+PSByZXN1bHQuY29tcHV0ZWQgJiYgKHJlc3VsdCA9IHt2YWx1ZSA6IHZhbHVlLCBjb21wdXRlZCA6IGNvbXB1dGVkfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC52YWx1ZTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWluLmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0VtcHR5KG9iaikpIHJldHVybiBJbmZpbml0eTtcbiAgICB2YXIgcmVzdWx0ID0ge2NvbXB1dGVkIDogSW5maW5pdHksIHZhbHVlOiBJbmZpbml0eX07XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0b3IgPyBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkgOiB2YWx1ZTtcbiAgICAgIGNvbXB1dGVkIDwgcmVzdWx0LmNvbXB1dGVkICYmIChyZXN1bHQgPSB7dmFsdWUgOiB2YWx1ZSwgY29tcHV0ZWQgOiBjb21wdXRlZH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJhbmQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBbXTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbShpbmRleCsrKTtcbiAgICAgIHNodWZmbGVkW2luZGV4IC0gMV0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gdmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZSA6IGZ1bmN0aW9uKG9iail7IHJldHVybiBvYmpbdmFsdWVdOyB9O1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSA6IHZhbHVlLFxuICAgICAgICBpbmRleCA6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYSA6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IDwgcmlnaHQuaW5kZXggPyAtMSA6IDE7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSwgY29udGV4dCwgYmVoYXZpb3IpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IodmFsdWUgfHwgXy5pZGVudGl0eSk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGZ1bmN0aW9uKG9iaiwgdmFsdWUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXAob2JqLCB2YWx1ZSwgY29udGV4dCwgZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgICAoXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0gOiAocmVzdWx0W2tleV0gPSBbXSkpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBmdW5jdGlvbihvYmosIHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwKG9iaiwgdmFsdWUsIGNvbnRleHQsIGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICBpZiAoIV8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0gPSAwO1xuICAgICAgcmVzdWx0W2tleV0rKztcbiAgICB9KTtcbiAgfTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYXRvciA9PSBudWxsID8gXy5pZGVudGl0eSA6IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4+IDE7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W21pZF0pIDwgdmFsdWUgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBTYWZlbHkgY29udmVydCBhbnl0aGluZyBpdGVyYWJsZSBpbnRvIGEgcmVhbCwgbGl2ZSBhcnJheS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICByZXR1cm4gKG4gIT0gbnVsbCkgJiYgIWd1YXJkID8gc2xpY2UuY2FsbChhcnJheSwgMCwgbikgOiBhcnJheVswXTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoXG4gIC8vIGBfLm1hcGAuXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBhcnJheS5sZW5ndGggLSAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbikpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmICgobiAhPSBudWxsKSAmJiAhZ3VhcmQpIHtcbiAgICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBNYXRoLm1heChhcnJheS5sZW5ndGggLSBuLCAwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgKG4gPT0gbnVsbCkgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBvdXRwdXQpIHtcbiAgICBlYWNoKGlucHV0LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgc2hhbGxvdyA/IHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSkgOiBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBvdXRwdXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29tcGxldGVseSBmbGF0dGVuZWQgdmVyc2lvbiBvZiBhbiBhcnJheS5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdG9yO1xuICAgICAgaXRlcmF0b3IgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbml0aWFsID0gaXRlcmF0b3IgPyBfLm1hcChhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIDogYXJyYXk7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGVhY2goaW5pdGlhbCwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBpZiAoaXNTb3J0ZWQgPyAoIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gdmFsdWUpIDogIV8uY29udGFpbnMoc2VlbiwgdmFsdWUpKSB7XG4gICAgICAgIHNlZW4ucHVzaCh2YWx1ZSk7XG4gICAgICAgIHJlc3VsdHMucHVzaChhcnJheVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihfLnVuaXEoYXJyYXkpLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICByZXR1cm4gXy5ldmVyeShyZXN0LCBmdW5jdGlvbihvdGhlcikge1xuICAgICAgICByZXR1cm4gXy5pbmRleE9mKG90aGVyLCBpdGVtKSA+PSAwO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJncywgJ2xlbmd0aCcpKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3MsIFwiXCIgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcGx5IHVzIHdpdGggaW5kZXhPZiAoSSdtIGxvb2tpbmcgYXQgeW91LCAqKk1TSUUqKiksXG4gIC8vIHdlIG5lZWQgdGhpcyBmdW5jdGlvbi4gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhblxuICAvLyBpdGVtIGluIGFuIGFycmF5LCBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgaW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gICAgZm9yICg7IGkgPCBsOyBpKyspIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBsYXN0SW5kZXhPZmAgaWYgYXZhaWxhYmxlLlxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBoYXNJbmRleCA9IGZyb20gIT0gbnVsbDtcbiAgICBpZiAobmF0aXZlTGFzdEluZGV4T2YgJiYgYXJyYXkubGFzdEluZGV4T2YgPT09IG5hdGl2ZUxhc3RJbmRleE9mKSB7XG4gICAgICByZXR1cm4gaGFzSW5kZXggPyBhcnJheS5sYXN0SW5kZXhPZihpdGVtLCBmcm9tKSA6IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0pO1xuICAgIH1cbiAgICB2YXIgaSA9IChoYXNJbmRleCA/IGZyb20gOiBhcnJheS5sZW5ndGgpO1xuICAgIHdoaWxlIChpLS0pIGlmIChhcnJheVtpXSA9PT0gaXRlbSkgcmV0dXJuIGk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPD0gMSkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBhcmd1bWVudHNbMl0gfHwgMTtcblxuICAgIHZhciBsZW4gPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIHJhbmdlID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICB3aGlsZShpZHggPCBsZW4pIHtcbiAgICAgIHJhbmdlW2lkeCsrXSA9IHN0YXJ0O1xuICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAoZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kICYmIG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGFsbCBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXRcbiAgLy8gYWxsIGNhbGxiYWNrcyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBmdW5jcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSBmdW5jcyA9IF8uZnVuY3Rpb25zKG9iaik7XG4gICAgZWFjaChmdW5jcywgZnVuY3Rpb24oZikgeyBvYmpbZl0gPSBfLmJpbmQob2JqW2ZdLCBvYmopOyB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vID0ge307XG4gICAgaGFzaGVyIHx8IChoYXNoZXIgPSBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIga2V5ID0gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gXy5oYXMobWVtbywga2V5KSA/IG1lbW9ba2V5XSA6IChtZW1vW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7IH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCB0aW1lb3V0LCByZXN1bHQ7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gbmV3IERhdGU7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gbmV3IERhdGU7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCByZXN1bHQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH07XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gW2Z1bmNdO1xuICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHdyYXBwZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmb3IgKHZhciBpID0gZnVuY3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgYXJncyA9IFtmdW5jc1tpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgaWYgKHRpbWVzIDw9IDApIHJldHVybiBmdW5jKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBuYXRpdmVLZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogIT09IE9iamVjdChvYmopKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5c1trZXlzLmxlbmd0aF0gPSBrZXk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSB2YWx1ZXMucHVzaChvYmpba2V5XSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBwYWlycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHBhaXJzLnB1c2goW2tleSwgb2JqW2tleV1dKTtcbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXN1bHRbb2JqW2tleV1dID0ga2V5O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGVhY2goa2V5cywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5IGluIG9iaikgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKCFfLmNvbnRhaW5zKGtleXMsIGtleSkpIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT0gbnVsbCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBIYXJtb255IGBlZ2FsYCBwcm9wb3NhbDogaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG4gICAgdmFyIHNpemUgPSAwLCByZXN1bHQgPSB0cnVlO1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChjbGFzc05hbWUgPT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBzaXplID0gYS5sZW5ndGg7XG4gICAgICByZXN1bHQgPSBzaXplID09IGIubGVuZ3RoO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gZXEoYVtzaXplXSwgYltzaXplXSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgKGFDdG9yIGluc3RhbmNlb2YgYUN0b3IpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgIGVzY2FwZToge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICAgJy8nOiAnJiN4MkY7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0O1xuICAvLyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKXtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHQnOiAgICAgJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHR8XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIGRhdGEsIHNldHRpbmdzKSB7XG4gICAgdmFyIHJlbmRlcjtcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBuZXcgUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KVxuICAgICAgICAucmVwbGFjZShlc2NhcGVyLCBmdW5jdGlvbihtYXRjaCkgeyByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07IH0pO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgXCJyZXR1cm4gX19wO1xcblwiO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSkgcmV0dXJuIHJlbmRlcihkYXRhLCBfKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIChzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJykgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbiwgd2hpY2ggd2lsbCBkZWxlZ2F0ZSB0byB0aGUgd3JhcHBlci5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfKG9iaikuY2hhaW4oKTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT0gJ3NoaWZ0JyB8fCBuYW1lID09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIGVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgXy5leHRlbmQoXy5wcm90b3R5cGUsIHtcblxuICAgIC8vIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgICBjaGFpbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLl9jaGFpbiA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gICAgfVxuXG4gIH0pO1xuXG59KS5jYWxsKHRoaXMpO1xuXG59KSgpIiwibW9kdWxlLmV4cG9ydHMgPSAoZm5zKSAtPlxuICAob2JqKSAtPlxuICAgIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yXG4gICAgZm4gPSBmbnNbY29uc3RydWN0b3IubmFtZV1cbiAgICB3aGlsZSAhZm4gYW5kIGNvbnN0cnVjdG9yLl9fc3VwZXJfX1xuICAgICAgY29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvci5fX3N1cGVyX18uY29uc3RydWN0b3JcbiAgICAgIGZuID0gZm5zW2NvbnN0cnVjdG9yLm5hbWVdXG4gICAgaWYgZm5cbiAgICAgIGZuLmFwcGx5IEAsIGFyZ3VtZW50c1xuICAgIGVsc2VcbiAgICAgIHRocm93IEVycm9yIFwibm8gbWF0Y2ggZm9yIHR5cGUgI3tjb25zdHJ1Y3Rvci5uYW1lfS5cIlxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24ocHJvY2Vzcyl7LypnbG9iYWwgc2V0SW1tZWRpYXRlOiBmYWxzZSwgc2V0VGltZW91dDogZmFsc2UsIGNvbnNvbGU6IGZhbHNlICovXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGFzeW5jID0ge307XG5cbiAgICAvLyBnbG9iYWwgb24gdGhlIHNlcnZlciwgd2luZG93IGluIHRoZSBicm93c2VyXG4gICAgdmFyIHJvb3QsIHByZXZpb3VzX2FzeW5jO1xuXG4gICAgcm9vdCA9IHRoaXM7XG4gICAgaWYgKHJvb3QgIT0gbnVsbCkge1xuICAgICAgcHJldmlvdXNfYXN5bmMgPSByb290LmFzeW5jO1xuICAgIH1cblxuICAgIGFzeW5jLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJvb3QuYXN5bmMgPSBwcmV2aW91c19hc3luYztcbiAgICAgICAgcmV0dXJuIGFzeW5jO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBvbmx5X29uY2UoZm4pIHtcbiAgICAgICAgdmFyIGNhbGxlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoY2FsbGVkKSB0aHJvdyBuZXcgRXJyb3IoXCJDYWxsYmFjayB3YXMgYWxyZWFkeSBjYWxsZWQuXCIpO1xuICAgICAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGZuLmFwcGx5KHJvb3QsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLy8vIGNyb3NzLWJyb3dzZXIgY29tcGF0aWJsaXR5IGZ1bmN0aW9ucyAvLy8vXG5cbiAgICB2YXIgX2VhY2ggPSBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvcikge1xuICAgICAgICBpZiAoYXJyLmZvckVhY2gpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnIuZm9yRWFjaChpdGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGFycltpXSwgaSwgYXJyKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX21hcCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yKSB7XG4gICAgICAgIGlmIChhcnIubWFwKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLm1hcChpdGVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgX2VhY2goYXJyLCBmdW5jdGlvbiAoeCwgaSwgYSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGl0ZXJhdG9yKHgsIGksIGEpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cbiAgICB2YXIgX3JlZHVjZSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBtZW1vKSB7XG4gICAgICAgIGlmIChhcnIucmVkdWNlKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyLnJlZHVjZShpdGVyYXRvciwgbWVtbyk7XG4gICAgICAgIH1cbiAgICAgICAgX2VhY2goYXJyLCBmdW5jdGlvbiAoeCwgaSwgYSkge1xuICAgICAgICAgICAgbWVtbyA9IGl0ZXJhdG9yKG1lbW8sIHgsIGksIGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcblxuICAgIHZhciBfa2V5cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgIGtleXMucHVzaChrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuXG4gICAgLy8vLyBleHBvcnRlZCBhc3luYyBtb2R1bGUgZnVuY3Rpb25zIC8vLy9cblxuICAgIC8vLy8gbmV4dFRpY2sgaW1wbGVtZW50YXRpb24gd2l0aCBicm93c2VyLWNvbXBhdGlibGUgZmFsbGJhY2sgLy8vL1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgfHwgIShwcm9jZXNzLm5leHRUaWNrKSkge1xuICAgICAgICBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgYXN5bmMubmV4dFRpY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhc3luYy5uZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gICAgfVxuXG4gICAgYXN5bmMuZWFjaCA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICBfZWFjaChhcnIsIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LCBvbmx5X29uY2UoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcGxldGVkID49IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2ggPSBhc3luYy5lYWNoO1xuXG4gICAgYXN5bmMuZWFjaFNlcmllcyA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb21wbGV0ZWQgPSAwO1xuICAgICAgICB2YXIgaXRlcmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIGl0ZXJhdG9yKGFycltjb21wbGV0ZWRdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3luYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGl0ZXJhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzeW5jID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIGl0ZXJhdGUoKTtcbiAgICB9O1xuICAgIGFzeW5jLmZvckVhY2hTZXJpZXMgPSBhc3luYy5lYWNoU2VyaWVzO1xuXG4gICAgYXN5bmMuZWFjaExpbWl0ID0gZnVuY3Rpb24gKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZm4gPSBfZWFjaExpbWl0KGxpbWl0KTtcbiAgICAgICAgZm4uYXBwbHkobnVsbCwgW2FyciwgaXRlcmF0b3IsIGNhbGxiYWNrXSk7XG4gICAgfTtcbiAgICBhc3luYy5mb3JFYWNoTGltaXQgPSBhc3luYy5lYWNoTGltaXQ7XG5cbiAgICB2YXIgX2VhY2hMaW1pdCA9IGZ1bmN0aW9uIChsaW1pdCkge1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICBpZiAoIWFyci5sZW5ndGggfHwgbGltaXQgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNvbXBsZXRlZCA9IDA7XG4gICAgICAgICAgICB2YXIgc3RhcnRlZCA9IDA7XG4gICAgICAgICAgICB2YXIgcnVubmluZyA9IDA7XG5cbiAgICAgICAgICAgIChmdW5jdGlvbiByZXBsZW5pc2ggKCkge1xuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAocnVubmluZyA8IGxpbWl0ICYmIHN0YXJ0ZWQgPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ZWQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRvcihhcnJbc3RhcnRlZCAtIDFdLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZWQgPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGVuaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICB9O1xuICAgIH07XG5cblxuICAgIHZhciBkb1BhcmFsbGVsID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW2FzeW5jLmVhY2hdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICB2YXIgZG9QYXJhbGxlbExpbWl0ID0gZnVuY3Rpb24obGltaXQsIGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW19lYWNoTGltaXQobGltaXQpXS5jb25jYXQoYXJncykpO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgdmFyIGRvU2VyaWVzID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW2FzeW5jLmVhY2hTZXJpZXNdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuXG4gICAgdmFyIF9hc3luY01hcCA9IGZ1bmN0aW9uIChlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGFyciA9IF9tYXAoYXJyLCBmdW5jdGlvbiAoeCwgaSkge1xuICAgICAgICAgICAgcmV0dXJuIHtpbmRleDogaSwgdmFsdWU6IHh9O1xuICAgICAgICB9KTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBpdGVyYXRvcih4LnZhbHVlLCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0c1t4LmluZGV4XSA9IHY7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdHMpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGFzeW5jLm1hcCA9IGRvUGFyYWxsZWwoX2FzeW5jTWFwKTtcbiAgICBhc3luYy5tYXBTZXJpZXMgPSBkb1NlcmllcyhfYXN5bmNNYXApO1xuICAgIGFzeW5jLm1hcExpbWl0ID0gZnVuY3Rpb24gKGFyciwgbGltaXQsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX21hcExpbWl0KGxpbWl0KShhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHZhciBfbWFwTGltaXQgPSBmdW5jdGlvbihsaW1pdCkge1xuICAgICAgICByZXR1cm4gZG9QYXJhbGxlbExpbWl0KGxpbWl0LCBfYXN5bmNNYXApO1xuICAgIH07XG5cbiAgICAvLyByZWR1Y2Ugb25seSBoYXMgYSBzZXJpZXMgdmVyc2lvbiwgYXMgZG9pbmcgcmVkdWNlIGluIHBhcmFsbGVsIHdvbid0XG4gICAgLy8gd29yayBpbiBtYW55IHNpdHVhdGlvbnMuXG4gICAgYXN5bmMucmVkdWNlID0gZnVuY3Rpb24gKGFyciwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKG1lbW8sIHgsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgICAgICBtZW1vID0gdjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbWVtbyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLy8gaW5qZWN0IGFsaWFzXG4gICAgYXN5bmMuaW5qZWN0ID0gYXN5bmMucmVkdWNlO1xuICAgIC8vIGZvbGRsIGFsaWFzXG4gICAgYXN5bmMuZm9sZGwgPSBhc3luYy5yZWR1Y2U7XG5cbiAgICBhc3luYy5yZWR1Y2VSaWdodCA9IGZ1bmN0aW9uIChhcnIsIG1lbW8sIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmV2ZXJzZWQgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9KS5yZXZlcnNlKCk7XG4gICAgICAgIGFzeW5jLnJlZHVjZShyZXZlcnNlZCwgbWVtbywgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIC8vIGZvbGRyIGFsaWFzXG4gICAgYXN5bmMuZm9sZHIgPSBhc3luYy5yZWR1Y2VSaWdodDtcblxuICAgIHZhciBfZmlsdGVyID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgYXJyID0gX21hcChhcnIsIGZ1bmN0aW9uICh4LCBpKSB7XG4gICAgICAgICAgICByZXR1cm4ge2luZGV4OiBpLCB2YWx1ZTogeH07XG4gICAgICAgIH0pO1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgudmFsdWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKF9tYXAocmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMuZmlsdGVyID0gZG9QYXJhbGxlbChfZmlsdGVyKTtcbiAgICBhc3luYy5maWx0ZXJTZXJpZXMgPSBkb1NlcmllcyhfZmlsdGVyKTtcbiAgICAvLyBzZWxlY3QgYWxpYXNcbiAgICBhc3luYy5zZWxlY3QgPSBhc3luYy5maWx0ZXI7XG4gICAgYXN5bmMuc2VsZWN0U2VyaWVzID0gYXN5bmMuZmlsdGVyU2VyaWVzO1xuXG4gICAgdmFyIF9yZWplY3QgPSBmdW5jdGlvbiAoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBhcnIgPSBfbWFwKGFyciwgZnVuY3Rpb24gKHgsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiB7aW5kZXg6IGksIHZhbHVlOiB4fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh4LCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaXRlcmF0b3IoeC52YWx1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKF9tYXAocmVzdWx0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICAgICAgICAgICAgfSksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHgudmFsdWU7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgYXN5bmMucmVqZWN0ID0gZG9QYXJhbGxlbChfcmVqZWN0KTtcbiAgICBhc3luYy5yZWplY3RTZXJpZXMgPSBkb1NlcmllcyhfcmVqZWN0KTtcblxuICAgIHZhciBfZGV0ZWN0ID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgbWFpbl9jYWxsYmFjaykge1xuICAgICAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2soeCk7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIG1haW5fY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5kZXRlY3QgPSBkb1BhcmFsbGVsKF9kZXRlY3QpO1xuICAgIGFzeW5jLmRldGVjdFNlcmllcyA9IGRvU2VyaWVzKF9kZXRlY3QpO1xuXG4gICAgYXN5bmMuc29tZSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2goYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgbWFpbl9jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIG1haW5fY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIGFueSBhbGlhc1xuICAgIGFzeW5jLmFueSA9IGFzeW5jLnNvbWU7XG5cbiAgICBhc3luYy5ldmVyeSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBtYWluX2NhbGxiYWNrKSB7XG4gICAgICAgIGFzeW5jLmVhY2goYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW5fY2FsbGJhY2soZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBtYWluX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgbWFpbl9jYWxsYmFjayh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBhbGwgYWxpYXNcbiAgICBhc3luYy5hbGwgPSBhc3luYy5ldmVyeTtcblxuICAgIGFzeW5jLnNvcnRCeSA9IGZ1bmN0aW9uIChhcnIsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBhc3luYy5tYXAoYXJyLCBmdW5jdGlvbiAoeCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yKHgsIGZ1bmN0aW9uIChlcnIsIGNyaXRlcmlhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3ZhbHVlOiB4LCBjcml0ZXJpYTogY3JpdGVyaWF9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYSwgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBfbWFwKHJlc3VsdHMuc29ydChmbiksIGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4LnZhbHVlO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGFzeW5jLmF1dG8gPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgIHZhciBrZXlzID0gX2tleXModGFza3MpO1xuICAgICAgICBpZiAoIWtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGFkZExpc3RlbmVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMudW5zaGlmdChmbik7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBmbikge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgdGFza0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX2VhY2gobGlzdGVuZXJzLnNsaWNlKDApLCBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKF9rZXlzKHJlc3VsdHMpLmxlbmd0aCA9PT0ga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfZWFjaChrZXlzLCBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSAodGFza3Nba10gaW5zdGFuY2VvZiBGdW5jdGlvbikgPyBbdGFza3Nba11dOiB0YXNrc1trXTtcbiAgICAgICAgICAgIHZhciB0YXNrQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzYWZlUmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBfZWFjaChfa2V5cyhyZXN1bHRzKSwgZnVuY3Rpb24ocmtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2FmZVJlc3VsdHNbcmtleV0gPSByZXN1bHRzW3JrZXldO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2FmZVJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHNhZmVSZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcCBzdWJzZXF1ZW50IGVycm9ycyBoaXR0aW5nIGNhbGxiYWNrIG11bHRpcGxlIHRpbWVzXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2tdID0gYXJncztcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2sodGFza0NvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIHJlcXVpcmVzID0gdGFzay5zbGljZSgwLCBNYXRoLmFicyh0YXNrLmxlbmd0aCAtIDEpKSB8fCBbXTtcbiAgICAgICAgICAgIHZhciByZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JlZHVjZShyZXF1aXJlcywgZnVuY3Rpb24gKGEsIHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhICYmIHJlc3VsdHMuaGFzT3duUHJvcGVydHkoeCkpO1xuICAgICAgICAgICAgICAgIH0sIHRydWUpICYmICFyZXN1bHRzLmhhc093blByb3BlcnR5KGspO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgdGFza1t0YXNrLmxlbmd0aCAtIDFdKHRhc2tDYWxsYmFjaywgcmVzdWx0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWFkeSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrW3Rhc2subGVuZ3RoIC0gMV0odGFza0NhbGxiYWNrLCByZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgYXN5bmMud2F0ZXJmYWxsID0gZnVuY3Rpb24gKHRhc2tzLCBjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICBpZiAoIXRhc2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHdyYXBJdGVyYXRvciA9IGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKHdyYXBJdGVyYXRvcihuZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdG9yLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICB3cmFwSXRlcmF0b3IoYXN5bmMuaXRlcmF0b3IodGFza3MpKSgpO1xuICAgIH07XG5cbiAgICB2YXIgX3BhcmFsbGVsID0gZnVuY3Rpb24oZWFjaGZuLCB0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgaWYgKHRhc2tzLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgZWFjaGZuLm1hcCh0YXNrcywgZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBlcnIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgZWFjaGZuLmVhY2goX2tleXModGFza3MpLCBmdW5jdGlvbiAoaywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0YXNrc1trXShmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNba10gPSBhcmdzO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0cyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5wYXJhbGxlbCA9IGZ1bmN0aW9uICh0YXNrcywgY2FsbGJhY2spIHtcbiAgICAgICAgX3BhcmFsbGVsKHsgbWFwOiBhc3luYy5tYXAsIGVhY2g6IGFzeW5jLmVhY2ggfSwgdGFza3MsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMucGFyYWxsZWxMaW1pdCA9IGZ1bmN0aW9uKHRhc2tzLCBsaW1pdCwgY2FsbGJhY2spIHtcbiAgICAgICAgX3BhcmFsbGVsKHsgbWFwOiBfbWFwTGltaXQobGltaXQpLCBlYWNoOiBfZWFjaExpbWl0KGxpbWl0KSB9LCB0YXNrcywgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy5zZXJpZXMgPSBmdW5jdGlvbiAodGFza3MsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG4gICAgICAgIGlmICh0YXNrcy5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgIGFzeW5jLm1hcFNlcmllcyh0YXNrcywgZnVuY3Rpb24gKGZuLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgICAgICBmbihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChudWxsLCBlcnIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xuICAgICAgICAgICAgYXN5bmMuZWFjaFNlcmllcyhfa2V5cyh0YXNrcyksIGZ1bmN0aW9uIChrLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRhc2tzW2tdKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyA9IGFyZ3NbMF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1trXSA9IGFyZ3M7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLml0ZXJhdG9yID0gZnVuY3Rpb24gKHRhc2tzKSB7XG4gICAgICAgIHZhciBtYWtlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFza3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2tzW2luZGV4XS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZm4ubmV4dCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZuLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpbmRleCA8IHRhc2tzLmxlbmd0aCAtIDEpID8gbWFrZUNhbGxiYWNrKGluZGV4ICsgMSk6IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGZuO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbWFrZUNhbGxiYWNrKDApO1xuICAgIH07XG5cbiAgICBhc3luYy5hcHBseSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoXG4gICAgICAgICAgICAgICAgbnVsbCwgYXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfY29uY2F0ID0gZnVuY3Rpb24gKGVhY2hmbiwgYXJyLCBmbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHgsIGNiKSB7XG4gICAgICAgICAgICBmbih4LCBmdW5jdGlvbiAoZXJyLCB5KSB7XG4gICAgICAgICAgICAgICAgciA9IHIuY29uY2F0KHkgfHwgW10pO1xuICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBhc3luYy5jb25jYXQgPSBkb1BhcmFsbGVsKF9jb25jYXQpO1xuICAgIGFzeW5jLmNvbmNhdFNlcmllcyA9IGRvU2VyaWVzKF9jb25jYXQpO1xuXG4gICAgYXN5bmMud2hpbHN0ID0gZnVuY3Rpb24gKHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGVzdCgpKSB7XG4gICAgICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMud2hpbHN0KHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMud2hpbHN0KHRlc3QsIGl0ZXJhdG9yLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzeW5jID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGFzeW5jLmRvV2hpbHN0ID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgIGl0ZXJhdG9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0ZXN0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3luYykge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYy5kb1doaWxzdChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLmRvV2hpbHN0KGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHN5bmMgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgYXN5bmMudW50aWwgPSBmdW5jdGlvbiAodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGVzdCgpKSB7XG4gICAgICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgICAgICBpdGVyYXRvcihmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMudW50aWwodGVzdCwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhc3luYy51bnRpbCh0ZXN0LCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBhc3luYy5kb1VudGlsID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCB0ZXN0LCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgIGl0ZXJhdG9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGVzdCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMuZG9VbnRpbChpdGVyYXRvciwgdGVzdCwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jLmRvVW50aWwoaXRlcmF0b3IsIHRlc3QsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgIH07XG5cbiAgICBhc3luYy5xdWV1ZSA9IGZ1bmN0aW9uICh3b3JrZXIsIGNvbmN1cnJlbmN5KSB7XG4gICAgICAgIGlmIChjb25jdXJyZW5jeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25jdXJyZW5jeSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2luc2VydChxLCBkYXRhLCBwb3MsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYoZGF0YS5jb25zdHJ1Y3RvciAhPT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX2VhY2goZGF0YSwgZnVuY3Rpb24odGFzaykge1xuICAgICAgICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHRhc2ssXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogdHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nID8gY2FsbGJhY2sgOiBudWxsXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgaWYgKHBvcykge1xuICAgICAgICAgICAgICAgIHEudGFza3MudW5zaGlmdChpdGVtKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBxLnRhc2tzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAocS5zYXR1cmF0ZWQgJiYgcS50YXNrcy5sZW5ndGggPT09IGNvbmN1cnJlbmN5KSB7XG4gICAgICAgICAgICAgICAgICBxLnNhdHVyYXRlZCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGFzeW5jLm5leHRUaWNrKHEucHJvY2Vzcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgd29ya2VycyA9IDA7XG4gICAgICAgIHZhciBxID0ge1xuICAgICAgICAgICAgdGFza3M6IFtdLFxuICAgICAgICAgICAgY29uY3VycmVuY3k6IGNvbmN1cnJlbmN5LFxuICAgICAgICAgICAgc2F0dXJhdGVkOiBudWxsLFxuICAgICAgICAgICAgZW1wdHk6IG51bGwsXG4gICAgICAgICAgICBkcmFpbjogbnVsbCxcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICBfaW5zZXJ0KHEsIGRhdGEsIGZhbHNlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5zaGlmdDogZnVuY3Rpb24gKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIF9pbnNlcnQocSwgZGF0YSwgdHJ1ZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAod29ya2VycyA8IHEuY29uY3VycmVuY3kgJiYgcS50YXNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhc2sgPSBxLnRhc2tzLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChxLmVtcHR5ICYmIHEudGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd29ya2VycyArPSAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3luYyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya2VycyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhc2suY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXNrLmNhbGxiYWNrLmFwcGx5KHRhc2ssIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocS5kcmFpbiAmJiBxLnRhc2tzLmxlbmd0aCArIHdvcmtlcnMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBxLnByb2Nlc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNiID0gb25seV9vbmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjYkFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0LmFwcGx5KG51bGwsIGNiQXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHdvcmtlcih0YXNrLmRhdGEsIGNiKTtcbiAgICAgICAgICAgICAgICAgICAgc3luYyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcS50YXNrcy5sZW5ndGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcnVubmluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3b3JrZXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcTtcbiAgICB9O1xuXG4gICAgYXN5bmMuY2FyZ28gPSBmdW5jdGlvbiAod29ya2VyLCBwYXlsb2FkKSB7XG4gICAgICAgIHZhciB3b3JraW5nICAgICA9IGZhbHNlLFxuICAgICAgICAgICAgdGFza3MgICAgICAgPSBbXTtcblxuICAgICAgICB2YXIgY2FyZ28gPSB7XG4gICAgICAgICAgICB0YXNrczogdGFza3MsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICAgICAgc2F0dXJhdGVkOiBudWxsLFxuICAgICAgICAgICAgZW1wdHk6IG51bGwsXG4gICAgICAgICAgICBkcmFpbjogbnVsbCxcbiAgICAgICAgICAgIHB1c2g6IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29uc3RydWN0b3IgIT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9lYWNoKGRhdGEsIGZ1bmN0aW9uKHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB0YXNrLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyA/IGNhbGxiYWNrIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmdvLnNhdHVyYXRlZCAmJiB0YXNrcy5sZW5ndGggPT09IHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmdvLnNhdHVyYXRlZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXN5bmMubmV4dFRpY2soY2FyZ28ucHJvY2Vzcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcHJvY2VzczogZnVuY3Rpb24gcHJvY2VzcygpIHtcbiAgICAgICAgICAgICAgICBpZiAod29ya2luZykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2FyZ28uZHJhaW4pIGNhcmdvLmRyYWluKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdHMgPSB0eXBlb2YgcGF5bG9hZCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHRhc2tzLnNwbGljZSgwLCBwYXlsb2FkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdGFza3Muc3BsaWNlKDApO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRzID0gX21hcCh0cywgZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhc2suZGF0YTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmKGNhcmdvLmVtcHR5KSBjYXJnby5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIHdvcmtpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHdvcmtlcihkcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3b3JraW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgICAgIF9lYWNoKHRzLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2tzLmxlbmd0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBydW5uaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdvcmtpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBjYXJnbztcbiAgICB9O1xuXG4gICAgdmFyIF9jb25zb2xlX2ZuID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncy5jb25jYXQoW2Z1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjb25zb2xlW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZWFjaChhcmdzLCBmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGVbbmFtZV0oeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1dKSk7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBhc3luYy5sb2cgPSBfY29uc29sZV9mbignbG9nJyk7XG4gICAgYXN5bmMuZGlyID0gX2NvbnNvbGVfZm4oJ2RpcicpO1xuICAgIC8qYXN5bmMuaW5mbyA9IF9jb25zb2xlX2ZuKCdpbmZvJyk7XG4gICAgYXN5bmMud2FybiA9IF9jb25zb2xlX2ZuKCd3YXJuJyk7XG4gICAgYXN5bmMuZXJyb3IgPSBfY29uc29sZV9mbignZXJyb3InKTsqL1xuXG4gICAgYXN5bmMubWVtb2l6ZSA9IGZ1bmN0aW9uIChmbiwgaGFzaGVyKSB7XG4gICAgICAgIHZhciBtZW1vID0ge307XG4gICAgICAgIHZhciBxdWV1ZXMgPSB7fTtcbiAgICAgICAgaGFzaGVyID0gaGFzaGVyIHx8IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1lbW8pIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseShudWxsLCBtZW1vW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5IGluIHF1ZXVlcykge1xuICAgICAgICAgICAgICAgIHF1ZXVlc1trZXldLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcXVldWVzW2tleV0gPSBbY2FsbGJhY2tdO1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MuY29uY2F0KFtmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9ba2V5XSA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHEgPSBxdWV1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHF1ZXVlc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcVtpXS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgbWVtb2l6ZWQubWVtbyA9IG1lbW87XG4gICAgICAgIG1lbW9pemVkLnVubWVtb2l6ZWQgPSBmbjtcbiAgICAgICAgcmV0dXJuIG1lbW9pemVkO1xuICAgIH07XG5cbiAgICBhc3luYy51bm1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoZm4udW5tZW1vaXplZCB8fCBmbikuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGFzeW5jLnRpbWVzID0gZnVuY3Rpb24gKGNvdW50LCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBjb3VudGVyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzeW5jLm1hcChjb3VudGVyLCBpdGVyYXRvciwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBhc3luYy50aW1lc1NlcmllcyA9IGZ1bmN0aW9uIChjb3VudCwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgY291bnRlci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc3luYy5tYXBTZXJpZXMoY291bnRlciwgaXRlcmF0b3IsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgYXN5bmMuY29tcG9zZSA9IGZ1bmN0aW9uICgvKiBmdW5jdGlvbnMuLi4gKi8pIHtcbiAgICAgICAgdmFyIGZucyA9IEFycmF5LnByb3RvdHlwZS5yZXZlcnNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICBhc3luYy5yZWR1Y2UoZm5zLCBhcmdzLCBmdW5jdGlvbiAobmV3YXJncywgZm4sIGNiKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgbmV3YXJncy5jb25jYXQoW2Z1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgY2IoZXJyLCBuZXh0YXJncyk7XG4gICAgICAgICAgICAgICAgfV0pKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSh0aGF0LCBbZXJyXS5jb25jYXQocmVzdWx0cykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGFzeW5jLmFwcGx5RWFjaCA9IGZ1bmN0aW9uIChmbnMgLyphcmdzLi4uKi8pIHtcbiAgICAgICAgdmFyIGdvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiBhc3luYy5lYWNoKGZucywgZnVuY3Rpb24gKGZuLCBjYikge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MuY29uY2F0KFtjYl0pKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIGdvLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGdvO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIEFNRCAvIFJlcXVpcmVKU1xuICAgIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzeW5jO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gTm9kZS5qc1xuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gYXN5bmM7XG4gICAgfVxuICAgIC8vIGluY2x1ZGVkIGRpcmVjdGx5IHZpYSA8c2NyaXB0PiB0YWdcbiAgICBlbHNlIHtcbiAgICAgICAgcm9vdC5hc3luYyA9IGFzeW5jO1xuICAgIH1cblxufSgpKTtcblxufSkocmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpKSIsIiNjaGVja1R5cGVPZiA9IChvYmosIHR5cGVTdHIpIC0+XG4jICBpZiB0eXBlb2Ygb2JqICE9IHR5cGVTdHJcbiMgICAgdGhyb3cgRXJyb3IgXCJcIlwiXG4jICAgICAgVHlwZSBFcnJvcjogZXhwZWN0ZWQgKHR5cGVvZikgJyN7dHlwZVN0cn0nLFxuIyAgICAgICAgZ290IHR5cGUgI3t0eXBlb2Ygb2JqfVxuIyAgICBcIlwiXCJcbiNtb2R1bGUuZXhwb3J0cyA9IChvYmosIHQpIC0+XG4jICBpZiBvYmogPT0gdW5kZWZpbmVkXG4jICAgIHRocm93IEVycm9yICdGaXJzdCBhcmd1bWVudCB0byB0eXBlKCkgaXMgbnVsbCdcbiMgIGlmIHQgPT0gdW5kZWZpbmVkXG4jICAgIHRocm93IEVycm9yICdTZWNvbmQgYXJndW1lbnQgdG8gdHlwZSgpIGlzIG51bGwnXG4jICBpZiB0ID09IE51bWJlclxuIyAgICBjaGVja1R5cGVPZiBvYmosICdudW1iZXInXG4jICBlbHNlIGlmIHQgPT0gU3RyaW5nXG4jICAgIGNoZWNrVHlwZU9mIG9iaiwgJ3N0cmluZydcbiMgIGVsc2UgaWYgb2JqLmNvbnN0cnVjdG9yICE9IHRcbiMgICAgY29uc3RyID0gb2JqLmNvbnN0cnVjdG9yXG4jICAgIHNob3VsZEVycm9yID0gY29uc3RyICE9IHRcbiMgICAgd2hpbGUgc2hvdWxkRXJyb3IgYW5kIGNvbnN0cj8uX19zdXBlcl9fXG4jICAgICAgY29uc3RyID0gY29uc3RyLl9fc3VwZXJfXy5jb25zdHJ1Y3RvclxuIyAgICAgIHNob3VsZEVycm9yID0gKGNvbnN0ciAhPSB0KVxuIyAgICBpZiBzaG91bGRFcnJvclxuIyAgICAgIHRocm93IEVycm9yIFwiXCJcIlxuIyAgICAgICAgVHlwZSBFcnJvcjogZXhwZWN0ZWQgdHlwZSAnI3t0Lm5hbWV9JyxcbiMgICAgICAgIGdvdCB0eXBlICN7Y29uc3RyLm5hbWV9XG4jICAgICAgXCJcIlwiXG4jXG4jY2hlY2tUeXBlT2YgPSAob2JqLCB0eXBlU3RyKSAtPlxuIyAgaWYgdHlwZW9mIG9iaiAhPSB0eXBlU3RyXG4jICAgIHRocm93IEVycm9yIFwiXCJcIlxuIyAgICAgIFR5cGUgRXJyb3I6IGV4cGVjdGVkICh0eXBlb2YpICcje3R5cGVTdHJ9JyxcbiMgICAgICAgIGdvdCB0eXBlICN7dHlwZW9mIG9ian1cbiMgICAgXCJcIlwiXG50eXBlID0gKG9iamVjdCwgZXhwZWN0ZWRUeXBlKSAtPlxuICBlcnJvciA9IGZhbHNlXG4gIGlmIGV4cGVjdGVkVHlwZSA9PSBOdW1iZXJcbiAgICBlcnJvciA9ICh0eXBlb2Ygb2JqZWN0ICE9ICdudW1iZXInKVxuICBlbHNlIGlmIGV4cGVjdGVkVHlwZSA9PSBTdHJpbmdcbiAgICBlcnJvciA9ICh0eXBlb2Ygb2JqZWN0ICE9ICdzdHJpbmcnKVxuICBlbHNlXG4gICAgYyA9IG9iamVjdC5jb25zdHJ1Y3RvclxuICAgIGVycm9yID0gKGMgIT0gZXhwZWN0ZWRUeXBlKVxuICAgICMgV2FsayB1cCB0aGUgY2xhc3MgaGllcmFyY2h5XG4gICAgd2hpbGUgZXJyb3IgYW5kIGM/Ll9fc3VwZXJfX1xuICAgICAgYyA9IGMuX19zdXBlcl9fLmNvbnN0cnVjdG9yXG4gICAgICBlcnJvciA9IChjICE9IGV4cGVjdGVkVHlwZSlcbiAgICBpZiBlcnJvclxuICAgICAgbWVzc2FnZSA9IFwiRXhwZWQgdHlwZSAsIGdvdCB0eXBlICcje3R5cGVvZiBvYmplY3R9XCJcbiAgaWYgZXJyb3JcbiAgICB0aHJvdyBFcnJvciAnVHlwZSBFcnJvcidcblxubW9kdWxlLmV4cG9ydHMgPSB0eXBlXG5cbiAgIyAgICBjb25zdHIgPSBvYmouY29uc3RydWN0b3JcbiAgIyAgICBzaG91bGRFcnJvciA9IGNvbnN0ciAhPSB0XG4gICMgICAgd2hpbGUgc2hvdWxkRXJyb3IgYW5kIGNvbnN0cj8uX19zdXBlcl9fXG4gICMgICAgICBjb25zdHIgPSBjb25zdHIuX19zdXBlcl9fLmNvbnN0cnVjdG9yXG4gICMgICAgICBzaG91bGRFcnJvciA9IChjb25zdHIgIT0gdClcbiIsImFyZ3NUb09wdGlvbnMgPSAoYXJncykgLT5cbiAgb3B0aW9ucyA9IHt9XG4gIGZvciBmbiBpbiBhcmdzXG4gICAgIyAgICB0eXBlIGZuLCBGblxuICAgIGlmIGZuLmFyZ3MubGVuZ3RoID09IDFcbiAgICAgIG9wdGlvbnNbZm4ubmFtZV0gPSBmbi5hcmdzWzBdXG4gICAgZWxzZVxuICAgICAgb3B0aW9uc1tmbi5uYW1lXSA9IGZuLmFyZ3NcbiAgcmV0dXJuIG9wdGlvbnNcblxubW9kdWxlLmV4cG9ydHMgPSBhcmdzVG9PcHRpb25zXG4iLCJ0eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcbmNsYXNzIEludGVydmFsXG4gIGNvbnN0cnVjdG9yOiAoQG1pbiwgQG1heCkgLT5cbiAgICB0eXBlIEBtaW4sIE51bWJlclxuICAgIHR5cGUgQG1heCwgTnVtYmVyXG4gIHNwYW46IC0+IEBtYXggLSBAbWluXG4gIHRvOiAoaW50ZXJ2YWwsIHZhbHVlKSAtPlxuICAgIHR5cGUgaW50ZXJ2YWwsIEludGVydmFsXG4gICAgdHlwZSB2YWx1ZSwgTnVtYmVyXG4gICAgKHZhbHVlIC0gQG1pbikgLyBAc3BhbigpICogaW50ZXJ2YWwuc3BhbigpICsgaW50ZXJ2YWwubWluXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWxcbiIsIm1hdGNoID0gcmVxdWlyZSAnLi9tYXRjaC5jb2ZmZWUnXG5tYXAgPSAocmVxdWlyZSAndW5kZXJzY29yZScpLm1hcFxuXG5zaG93ID0gbWF0Y2hcbiAgUHJvZ3JhbTogKHtzdG10c30pIC0+IChtYXAgc3RtdHMsIHNob3cpLmpvaW4gJ1xcbidcbiAgRGF0YTogKHtuYW1lLCBleHByfSkgLT4gXCJEQVRBOiAje25hbWV9ID0gI3tzaG93IGV4cHJ9XCJcbiAgU291cmNlOiAoe2NzdlBhdGh9KSAtPiBcIlNPVVJDRTogXFxcIiN7Y3N2UGF0aH1cXFwiXCJcbiAgRm5TdG10IDogKHtsYWJlbCwgZm59KSAtPiBcIiN7bGFiZWx9OiAje3Nob3cgZm59XCJcbiAgUHJpbWl0aXZlOiAoe3ZhbHVlfSkgLT4gdmFsdWVcbiAgU3RyOiAoe3ZhbHVlfSkgLT4gJ1wiJyt2YWx1ZSsnXCInXG4gIEZuOiAoe25hbWUsIGFyZ3N9KSAtPiBcIiN7bmFtZX0oI3sobWFwIGFyZ3MsIHNob3cpLmpvaW4gJywgJ30pXCJcbiAgT3A6ICh7bGVmdCwgcmlnaHQsIHN5bX0pIC0+IFwiI3tzaG93IGxlZnR9I3tzeW19I3tzaG93IHJpZ2h0fVwiXG4gICNSZWxhdGlvbjogKHIpIC0+IFwiPFJlbGF0aW9uIHdpdGggI3tyLm0oKX0gcm93cyBhbmQgI3tyLm4oKX0gY29sdW1ucz5cIlxuICBSZWxhdGlvbjogKHIpIC0+IFwiXFxuXCIrci50b0NTVigpK1wiXFxuXCJcblxubW9kdWxlLmV4cG9ydHMgPSBzaG93XG4iLCJ0eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xubWFwID0gXy5tYXBcbmZpcnN0ID0gXy5maXJzdFxucmVzdCA9IF8ucmVzdFxudW5pb24gPSBfLnVuaW9uXG5cbmNsYXNzIFJlbGF0aW9uXG4gIGNvbnN0cnVjdG9yOiAoQGtleXMsIEBhdHRyaWJ1dGVzKSAtPlxuICBhdHRyaWJ1dGU6IChuYW1lKSAtPiBfLmZpbmRXaGVyZSBAYXR0cmlidXRlcywge25hbWV9XG4gIG46IC0+IEBhdHRyaWJ1dGVzLmxlbmd0aFxuICBtOiAtPiBAa2V5cy5sZW5ndGhcbiAgdG9DU1Y6IC0+XG4gICAgbmFtZXMgPSAoYXR0ci5uYW1lIGZvciBhdHRyIGluIEBhdHRyaWJ1dGVzKS5qb2luICcsJ1xuICAgIGxpbmUgPSAoa2V5KSA9PlxuICAgICAgKGF0dHIubWFwW2tleV0gZm9yIGF0dHIgaW4gQGF0dHJpYnV0ZXMpLmpvaW4gJywnXG4gICAgdHVwbGVzID0gKG1hcCBAa2V5cywgbGluZSkuam9pbiAnXFxuJ1xuICAgIG5hbWVzICsgJ1xcbicgKyB0dXBsZXNcblxuY2xhc3MgQXR0cmlidXRlXG4gIGNvbnN0cnVjdG9yOiAoQG5hbWUsIEBrZXlzLCBAbWFwKSAtPlxuICB2YWx1ZXM6IC0+IEBtYXBba2V5XSBmb3Iga2V5IGluIEBrZXlzXG5SZWxhdGlvbi5BdHRyaWJ1dGUgPSBBdHRyaWJ1dGVcblxuUmVsYXRpb24uZnJvbUF0dHJpYnV0ZSA9IChhdHRyKSAtPlxuICBuZXcgUmVsYXRpb24gYXR0ci5rZXlzLCBbYXR0cl1cblxuUmVsYXRpb24uZnJvbVRhYmxlID0gKHRhYmxlKSAtPlxuICBuYW1lcyA9IGZpcnN0IHRhYmxlXG4gIHR1cGxlcyA9IHJlc3QgdGFibGVcblxuICBuID0gbmFtZXMubGVuZ3RoXG4gIG0gPSB0dXBsZXMubGVuZ3RoXG5cbiAga2V5cyA9IFswLi4ubV1cbiAgXG4gIGF0dHJpYnV0ZXMgPSBmb3IgaSBpbiBbMC4uLm5dXG4gICAgbmFtZSA9IG5hbWVzW2ldXG4gICAga2V5VmFsdWVNYXAgPSB7fVxuICAgIGZvciBrZXkgaW4ga2V5c1xuICAgICAgdHVwbGUgPSB0dXBsZXNba2V5XVxuICAgICAga2V5VmFsdWVNYXBba2V5XSA9IHBhcnNlRmxvYXQgdHVwbGVbaV1cbiAgICBuZXcgQXR0cmlidXRlIG5hbWUsIGtleXMsIGtleVZhbHVlTWFwXG5cbiAgbmV3IFJlbGF0aW9uIGtleXMsIGF0dHJpYnV0ZXNcblxuUmVsYXRpb24uY3Jvc3MgPSAoYSwgYikgLT5cbiAgdHlwZSBhLCBSZWxhdGlvblxuICB0eXBlIGIsIFJlbGF0aW9uXG4jIGFzc3VtZSBrZXkgc2V0IG1hdGNoZXMgYmV0d2VlbiBhIGFuZCBiXG4gIGtleXMgPSBhLmtleXNcbiAgYXR0cmlidXRlcyA9IHVuaW9uIGEuYXR0cmlidXRlcywgYi5hdHRyaWJ1dGVzXG4gIG5ldyBSZWxhdGlvbiBrZXlzLCBhdHRyaWJ1dGVzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBSZWxhdGlvblxuIiwiXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG50eXBlID0gcmVxdWlyZSAnLi90eXBlLmNvZmZlZSdcblxuY2xhc3MgQVNUXG5cbmNsYXNzIFByb2dyYW0gZXh0ZW5kcyBBU1RcbiAgY29uc3RydWN0b3I6IChAc3RtdHMpIC0+XG5cbmNsYXNzIFN0bXQgZXh0ZW5kcyBBU1RcblxuY2xhc3MgU291cmNlIGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBjc3ZQYXRoKSAtPlxuICAgIHR5cGUgQGNzdlBhdGgsIFN0cmluZ1xuXG5jbGFzcyBEYXRhIGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBuYW1lLCBAZXhwcikgLT5cbiAgICB0eXBlIEBuYW1lLCBTdHJpbmdcbiAgICAjIHR5cGUgQGV4cHIgTmFtZSBvciBTdHJpbmdcblxuY2xhc3MgRm5TdG10IGV4dGVuZHMgU3RtdFxuICBjb25zdHJ1Y3RvcjogKEBsYWJlbCwgQGZuKSAtPlxuICAgIHR5cGUgQGxhYmVsLCBTdHJpbmdcbiAgICB0eXBlIEBmbiwgRm5cblxuRm5TdG10LmNyZWF0ZSA9IChsYWJlbCwgZm4pIC0+XG4gIHN3aXRjaCBsYWJlbFxuICAgIHdoZW4gJ1NDQUxFJyB0aGVuIG5ldyBTY2FsZSBsYWJlbCwgZm5cbiAgICB3aGVuICdDT09SRCcgdGhlbiBuZXcgQ29vcmQgbGFiZWwsIGZuXG4gICAgd2hlbiAnR1VJREUnIHRoZW4gbmV3IEd1aWRlIGxhYmVsLCBmblxuICAgIHdoZW4gJ0VMRU1FTlQnIHRoZW4gbmV3IEVsZW1lbnQgbGFiZWwsIGZuXG5cbmNsYXNzIFNjYWxlIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIENvb3JkIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIEd1aWRlIGV4dGVuZHMgRm5TdG10XG5cbmNsYXNzIEVsZW1lbnQgZXh0ZW5kcyBGblN0bXRcblxuY2xhc3MgRXhwciBleHRlbmRzIEFTVFxuXG5jbGFzcyBGbiBleHRlbmRzIEV4cHJcbiAgY29uc3RydWN0b3I6IChAbmFtZSwgQGFyZ3MpIC0+XG4gICAgdHlwZSBAbmFtZSwgU3RyaW5nXG4jIHR5cGUgQGFyZ3MsIEFycmF5PEV4cHI+XG5cbmNsYXNzIE9wIGV4dGVuZHMgRXhwclxuICBjb25zdHJ1Y3RvcjogKEBsZWZ0LCBAcmlnaHQsIEBzeW0pIC0+XG4gICAgdHlwZSBAbGVmdCwgTmFtZVxuICAgIHR5cGUgQHJpZ2h0LCBFeHByXG5cbk9wLmNyZWF0ZSA9IChsZWZ0LCByaWdodCwgc3ltKSAtPlxuICBzd2l0Y2ggc3ltXG4gICAgd2hlbiAnKicgdGhlbiBuZXcgQ3Jvc3MgbGVmdCwgcmlnaHQsIHN5bVxuICAgIHdoZW4gJysnIHRoZW4gbmV3IEJsZW5kIGxlZnQsIHJpZ2h0LCBzeW1cbiAgICB3aGVuICcvJyB0aGVuIG5ldyBOZXN0IGxlZnQsIHJpZ2h0LCBzeW1cblxuY2xhc3MgQ3Jvc3MgZXh0ZW5kcyBPcFxuXG5jbGFzcyBCbGVuZCBleHRlbmRzIE9wXG5cbmNsYXNzIE5lc3QgZXh0ZW5kcyBPcFxuXG5jbGFzcyBQcmltaXRpdmUgZXh0ZW5kcyBFeHByXG5cbmNsYXNzIE5hbWUgZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIFN0cmluZ1xuXG5jbGFzcyBTdHIgZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIFN0cmluZ1xuXG5jbGFzcyBOdW0gZXh0ZW5kcyBQcmltaXRpdmVcbiAgY29uc3RydWN0b3I6IChAdmFsdWUpIC0+XG4gICAgdHlwZSBAdmFsdWUsIE51bWJlclxuXG5fLmV4dGVuZCBBU1QsIHtcbiAgUHJvZ3JhbSwgU3RtdCwgRGF0YSwgU291cmNlLCBGblN0bXQsXG4gIFNjYWxlLCBDb29yZCwgR3VpZGUsIEVsZW1lbnQsXG4gIEV4cHIsIFByaW1pdGl2ZSwgTmFtZSwgU3RyLCBOdW0sIEZuLFxuICBPcCwgQ3Jvc3MsIEJsZW5kLCBOZXN0XG59XG5tb2R1bGUuZXhwb3J0cyA9IEFTVFxuIiwidHlwZSA9IHJlcXVpcmUgJy4vdHlwZS5jb2ZmZWUnXG5SZWxhdGlvbiA9IHJlcXVpcmUgJy4vUmVsYXRpb24uY29mZmVlJ1xuQXR0cmlidXRlID0gUmVsYXRpb24uQXR0cmlidXRlXG5JbnRlcnZhbCA9IHJlcXVpcmUgJy4vSW50ZXJ2YWwuY29mZmVlJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5taW4gPSBfLm1pblxubWF4ID0gXy5tYXhcblxuY2xhc3MgU2NhbGVcbiAgYXBwbHk6IChhdHRyaWJ1dGUpIC0+XG4gICAgdHlwZSBhdHRyaWJ1dGUsIEF0dHJpYnV0ZVxuICAgIHZhbHVlcyA9IGF0dHJpYnV0ZS52YWx1ZXMoKVxuICAgIHNyYyA9IG5ldyBJbnRlcnZhbCAobWluIHZhbHVlcyksIChtYXggdmFsdWVzKVxuICAgIGRlc3QgPSBuZXcgSW50ZXJ2YWwgMCwgMVxuICAgIG5vcm1hbGl6ZSA9IChrZXkpIC0+IHNyYy50byBkZXN0LCBhdHRyaWJ1dGUubWFwW2tleV1cblxuICAgIG5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGtleXMgPSBhdHRyaWJ1dGUua2V5c1xuICAgIG1hcCA9IHt9XG4gICAgZm9yIGtleSBpbiBrZXlzXG4gICAgICBtYXBba2V5XSA9IG5vcm1hbGl6ZSBrZXlcbiAgICBuZXcgQXR0cmlidXRlIG5hbWUsIGtleXMsIG1hcFxuXG5tb2R1bGUuZXhwb3J0cyA9IFNjYWxlXG4iXX0=
;