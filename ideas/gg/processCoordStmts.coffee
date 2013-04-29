match = require './match.coffee'
argsToOptions = require './argsToOptions.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact

processCoordStmts = (ast) ->
  coordStmts = extractCoordStmts ast
  if coordStmts.length != 1
    throw Error "Exactly 1 COORD statement expected, got #{coordStmts.length}"
  {fn} = coordStmts[0]
  {dim} = argsToOptions fn.args
  makeCoordinates = coordFactories[fn.name]
  makeCoordinates(dim)

extractCoordStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractCoordStmts
  Coord: (c) -> c
  AST: ->

coordFactories =
  rect: (dim) -> new CoordinateSpace

class CoordinateSpace

module.exports = processCoordStmts
