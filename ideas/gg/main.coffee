$ = require 'jquery-browserify'
_ = require 'underscore'
map = _.map
parser = require './parser.js'
parse = parser.parse
match = require './match.coffee'
AST = require './AST.coffee'
Program = AST.Program
Data = AST.Data
Name = AST.Name

show = match
  Program: ({stmts}) -> (map stmts, show).join '\n'
  Data: ({left, right}) -> "DATA: #{left} = #{right}"

e = (actual, expected) -> if actual != expected
  throw new Error "Expected '#{expected}', got '#{actual}'"

check = (expr) -> e expr, (show parse expr)
check 'DATA: x = y'
check """
DATA: x = y
DATA: q = z
 
"""
console.log 'All tests passed!'
#console.log show parse expr
