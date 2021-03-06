match = require './match.coffee'
type = require './type.coffee'
Relation = require './Relation.coffee'
Scale = require './Scale.coffee'
AST = require './AST.coffee'
Program = AST.Program
Element = AST.Element
Fn = AST.Fn
argsToOptions = require './argsToOptions.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact

processScaleStmts = (ast) ->
  scalesByDim = extractScalesByDim ast
  scales = match
    Program: ({stmts}) -> new Program map stmts, scales
#TODO make the label argument optional, reverse order
# it's stupid to pass in 'ELEMENT' to new Element()
    Element: ({fn}) -> new Element 'ELEMENT', scales fn
    Fn: ({name, args}) -> new Fn name, map args, scales
    Relation: (relation) -> applyScales relation, scalesByDim
    AST: (ast) -> ast
  return scales ast

extractScalesByDim = (ast) ->
  scalesByDim = {}
  for {fn:{args, name}} in (extractScaleStmts ast)
    {dim:{value}} = argsToOptions args
    makeScale = scaleFactories[name]
    scalesByDim[value] = makeScale()
  return scalesByDim

extractScaleStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractScaleStmts
  Scale: (s) -> s
  AST: ->

scaleFactories =
  linear: -> new Scale

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
