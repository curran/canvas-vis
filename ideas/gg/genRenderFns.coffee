match = require './match.coffee'
argsToOptions = require './argsToOptions.coffee'
Interval = require './Interval.coffee'
Scale = require './Scale.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact
first = _.first

genRenderFns = (ast) ->
  elementStmts = extractElementStmts ast
  map elementStmts, ({fn}) ->
    options = argsToOptions fn.args
    keys: extractKeys fn
    geometry: genGeometryFn fn.name, options
    aesthetics: genAestheticsFn fn.name, options

extractElementStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractElementStmts
  Element: (e) -> e
  AST: ->

extractKeys = match
  Fn: ({name, args}) ->
    first map args, extractKeys
  Relation: (relation) -> relation.keys
  AST: ->

genGeometryFn = (fnName, options) ->
  geometryFns[fnName] options

geometryFns =
  point: (options) ->
    if options.position
      relation = options.position
      attrs = relation.attributes
      (key, mark) ->
        if attrs.length == 1
          mark.x(relation.attributes[0].map[key])
              .y(0.5)
        else if attrs.length == 2
          mark.x(relation.attributes[0].map[key])
              .y(relation.attributes[1].map[key])
    else (key, mark) -> mark

genAestheticsFn = (fnName, options) ->
  aestheticsFns[fnName] options

aestheticsFns =
  point: ({size}) ->
    if size
      minSize = 0.01
      maxSize = 0.05
      unit = new Interval 0, 1
      sizes = new Interval minSize, maxSize
      scale = new Scale
#      scale.dest.min = 0.1
#      scale.dest.max = 0.1
      attr = size.attributes[0]
      attr = scale.apply attr
      (key, mark) ->
        val = attr.map[key]
        mark.size unit.to sizes, val
    else (key, mark) -> mark

module.exports = genRenderFns 
