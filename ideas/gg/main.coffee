tests = require './tests.coffee'
processSourceStmts = require './processSourceStmts.coffee'
getFile = require './getFile.coffee'
parse = (require './parser.js').parse
match = require './match.coffee'
AST = require './AST.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact
identity = _.identity

# Run unit tests for parser
tests()

evaluate = (expr, canvas) ->
  ast = parse expr

  # Step 1: Process SOURCE statements
  processSourceStmts ast, (err, vars) ->
    console.log vars
    # Step 2: Process DATA statements
    vars_1 = variables ast, vars
    console.log vars_1

extractDataStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractDataStmts
  Data: identity
  AST: ->

variables = (ast, vars_0) ->
  vars_1 = _.clone vars_0
  dataStmts = extractDataStmts ast
  for dataStmt in dataStmts
    newName = dataStmt.name
    oldName = dataStmt.expr.value
    vars_1[newName] = vars_0[oldName]
  return vars_1


getFile 'gg/scatter.gg', (err, expr) ->
  evaluate expr, canvas
