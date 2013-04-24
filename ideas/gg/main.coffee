parser = require './parser.js'
match = require './match.coffee'
AST = require './AST.coffee'
Program = AST.Program
Data = AST.Data
Name = AST.Name

show = match
  Program: ({stmts}) ->
    (show s for s in stmts).join '\n'
  Data: ({left, right}) -> "DATA: #{left} = #{right}"

console.log 'hello'
expr = """
  DATA: x = y
"""
console.log parser.parse expr
console.log show parser.parse expr
