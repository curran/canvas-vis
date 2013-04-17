define([],function(){
parser = (function(){
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
        "statement": parse_statement,
        "data": parse_data,
        "statementType": parse_statementType,
        "expr": parse_expr,
        "function": parse_function,
        "args": parse_args,
        "arg": parse_arg,
        "assignment": parse_assignment,
        "name": parse_name,
        "number": parse_number,
        "string": parse_string,
        "cross": parse_cross
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
        result0 = [];
        result1 = parse_statement();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_statement();
        }
        if (result0 !== null) {
          result0 = (function(offset, statements) {return {type:"statements", statements:statements}})(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_statement() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        result0 = parse_data();
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_statementType();
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
              if (input.charCodeAt(pos) === 32) {
                result3 = " ";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result3 !== null) {
                result2.push(result3);
                if (input.charCodeAt(pos) === 32) {
                  result3 = " ";
                  pos++;
                } else {
                  result3 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
              }
              if (result2 !== null) {
                result3 = parse_expr();
                if (result3 !== null) {
                  result4 = [];
                  if (input.charCodeAt(pos) === 10) {
                    result5 = "\n";
                    pos++;
                  } else {
                    result5 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"\\n\"");
                    }
                  }
                  while (result5 !== null) {
                    result4.push(result5);
                    if (input.charCodeAt(pos) === 10) {
                      result5 = "\n";
                      pos++;
                    } else {
                      result5 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"\\n\"");
                      }
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
            result0 = (function(offset, statementType, expr) {return {type:"statement", statementType:statementType, expr:expr};})(pos0, result0[0], result0[3]);
          }
          if (result0 === null) {
            pos = pos0;
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
          if (input.charCodeAt(pos) === 32) {
            result2 = " ";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (input.charCodeAt(pos) === 32) {
              result2 = " ";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
          }
          if (result1 !== null) {
            result2 = parse_name();
            if (result2 !== null) {
              result3 = [];
              if (input.charCodeAt(pos) === 32) {
                result4 = " ";
                pos++;
              } else {
                result4 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result4 !== null) {
                result3.push(result4);
                if (input.charCodeAt(pos) === 32) {
                  result4 = " ";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
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
                  if (input.charCodeAt(pos) === 32) {
                    result6 = " ";
                    pos++;
                  } else {
                    result6 = null;
                    if (reportFailures === 0) {
                      matchFailed("\" \"");
                    }
                  }
                  while (result6 !== null) {
                    result5.push(result6);
                    if (input.charCodeAt(pos) === 32) {
                      result6 = " ";
                      pos++;
                    } else {
                      result6 = null;
                      if (reportFailures === 0) {
                        matchFailed("\" \"");
                      }
                    }
                  }
                  if (result5 !== null) {
                    result6 = parse_string();
                    if (result6 !== null) {
                      result7 = [];
                      if (input.charCodeAt(pos) === 10) {
                        result8 = "\n";
                        pos++;
                      } else {
                        result8 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"\\n\"");
                        }
                      }
                      while (result8 !== null) {
                        result7.push(result8);
                        if (input.charCodeAt(pos) === 10) {
                          result8 = "\n";
                          pos++;
                        } else {
                          result8 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"\\n\"");
                          }
                        }
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
          result0 = (function(offset, left, right) {
            return {
              type:"data", 
              oldName:right.value,
              newName:left.name
            };
          })(pos0, result0[2], result0[6]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_statementType() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        if (/^[A-Z]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[A-Z]");
          }
        }
        while (result1 !== null) {
          result0.push(result1);
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
        if (result0 !== null) {
          result0 = (function(offset, chars) { return chars.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_expr() {
        var result0;
        
        result0 = parse_function();
        if (result0 === null) {
          result0 = parse_assignment();
          if (result0 === null) {
            result0 = parse_cross();
            if (result0 === null) {
              result0 = parse_name();
              if (result0 === null) {
                result0 = parse_number();
                if (result0 === null) {
                  result0 = parse_string();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_function() {
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
          result0 = (function(offset, name, args) {return {type:"function", name:name.join(""), args:args};})(pos0, result0[0], result0[1]);
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
          if (input.charCodeAt(pos) === 32) {
            result2 = " ";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (input.charCodeAt(pos) === 32) {
              result2 = " ";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
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
              if (input.charCodeAt(pos) === 32) {
                result4 = " ";
                pos++;
              } else {
                result4 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result4 !== null) {
                result3.push(result4);
                if (input.charCodeAt(pos) === 32) {
                  result4 = " ";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
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
          if (input.charCodeAt(pos) === 32) {
            result1 = " ";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
          while (result1 !== null) {
            result0.push(result1);
            if (input.charCodeAt(pos) === 32) {
              result1 = " ";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
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
              if (input.charCodeAt(pos) === 32) {
                result3 = " ";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result3 !== null) {
                result2.push(result3);
                if (input.charCodeAt(pos) === 32) {
                  result3 = " ";
                  pos++;
                } else {
                  result3 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
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
      
      function parse_assignment() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_name();
        if (result0 !== null) {
          result1 = [];
          if (input.charCodeAt(pos) === 32) {
            result2 = " ";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (input.charCodeAt(pos) === 32) {
              result2 = " ";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
          }
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 61) {
              result2 = "=";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"=\"");
              }
            }
            if (result2 !== null) {
              result3 = [];
              if (input.charCodeAt(pos) === 32) {
                result4 = " ";
                pos++;
              } else {
                result4 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result4 !== null) {
                result3.push(result4);
                if (input.charCodeAt(pos) === 32) {
                  result4 = " ";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
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
          result0 = (function(offset, left, right) { return {type:"assignment", left:left, right:right}})(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
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
          result0 = (function(offset, chars) { return {type:"name", name:chars.join("")}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_number() {
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
          result0 = (function(offset, chars) { return {type:"number", value:parseFloat(chars.join(""))}; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_string() {
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
          result0 = (function(offset, chars) { return {type:"string", value:chars.join("")}; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_cross() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_name();
        if (result0 !== null) {
          result1 = [];
          if (input.charCodeAt(pos) === 32) {
            result2 = " ";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\" \"");
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            if (input.charCodeAt(pos) === 32) {
              result2 = " ";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\" \"");
              }
            }
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
            if (result2 !== null) {
              result3 = [];
              if (input.charCodeAt(pos) === 32) {
                result4 = " ";
                pos++;
              } else {
                result4 = null;
                if (reportFailures === 0) {
                  matchFailed("\" \"");
                }
              }
              while (result4 !== null) {
                result3.push(result4);
                if (input.charCodeAt(pos) === 32) {
                  result4 = " ";
                  pos++;
                } else {
                  result4 = null;
                  if (reportFailures === 0) {
                    matchFailed("\" \"");
                  }
                }
              }
              if (result3 !== null) {
                result4 = parse_name();
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
          result0 = (function(offset, left, right) { return {type:"cross", left:left, right:right}})(pos0, result0[0], result0[4]);
        }
        if (result0 === null) {
          pos = pos0;
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
return parser;});
