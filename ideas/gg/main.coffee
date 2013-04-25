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
  Data: ({name, expr}) -> "DATA: #{name} = #{show expr}"
  Name: ({value}) -> value
  Str: ({value}) -> '"'+value+'"'

e = (actual, expected) -> if actual != expected
  throw new Error "Expected '#{expected}', got '#{actual}'"

check = (expr) -> e (show parse expr), expr
check 'DATA: x = y'
check """
DATA: x = y
DATA: q = z
"""
check 'DATA: x = "sepal length"'
console.log 'All tests passed!'
#console.log show parse expr
