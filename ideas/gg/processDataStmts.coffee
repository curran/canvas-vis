match = require './match.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact

processDataStmts = (ast, vars) ->
  dataStmts = extractDataStmts ast
  for dataStmt in dataStmts
    newName = dataStmt.name
    oldName = dataStmt.expr.value
    vars[newName] = vars[oldName]
  return vars

extractDataStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractDataStmts
  Data: (d) -> d
  AST: ->

module.exports = processDataStmts
