match = require './match.coffee'
type = require './type.coffee'
Relation = require './Relation.coffee'
Scale = require './Scale.coffee'
AST = require './AST.coffee'
Program = AST.Program
Element = AST.Element
Fn = AST.Fn
_ = require 'underscore'
map = _.map
compact = _.compact

processScaleStmts = (ast) ->
  scalesByDim = extractScalesByDim ast
  scales = match
    Program: ({stmts}) -> new Program map stmts, scales
#TODO make the label argument optional, reverse order
    Element: ({fn}) -> new Element 'ELEMENT', scales fn
    Fn: ({name, args}) -> new Fn name, map args, scales
    Relation: (relation) -> applyScales relation, scalesByDim
    AST: (ast) -> ast
  return scales ast

extractScalesByDim = (ast) ->
  scaleStmts = extractScaleStmts ast
  scalesByDim = {}
  for {fn} in scaleStmts
    {dim} = argsToOptions fn.args
    makeScale = scaleFactories[fn.name]
    scalesByDim[dim] = makeScale()
  console.log scalesByDim
  return scalesByDim

scaleFactories =
  linear: -> new Scale

argsToOptions = (args) ->
  options = {}
  for fn in args
    type fn, Fn
    if args.length == 1
      options[fn.name] = fn.args[0].value
    else
      options[fn.name] = (arg.value for arg in fn.args)
  return options



extractScaleStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractScaleStmts
  Scale: (s) -> s
  AST: ->

applyScales = (relation, scalesByDim) ->
  keys = relation.keys
  attributes = for dim in [1..relation.attributes.length]
    attribute = relation.attributes[dim-1]
    if scalesByDim[dim]
      scalesByDim[dim].apply attribute
    else
      attribute
  new Relation keys, attributes

module.exports = processScaleStmts
