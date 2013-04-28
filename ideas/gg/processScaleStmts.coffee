match = require './match.coffee'
Relation = require './Relation.coffee'
Scale = require './Scale.coffee'
AST = require './AST.coffee'
Program = AST.Program
Element = AST.Element
#Stmt = AST.Stmt
Fn = AST.Fn
#Cross = AST.Cross
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
    Relation: (relation) ->
      keys = relation.keys
      attributes = for dim in [1..relation.attributes.length]
        attribute = relation.attributes[dim-1]
        if scalesByDim[dim]
          scalesByDim[dim].apply attribute
        else
          attribute
      new Relation keys, attributes
    AST: (ast) -> ast
  return scales ast

extractScalesByDim = (ast) ->
  scaleStmts = extractScaleStmts ast
  scalesByDim = {}
  for {fn} in scaleStmts
    if fn.name = 'linear'
      #TODO generalize
      console.log fn
      dim = fn.args[0].args[0].value
      scalesByDim[dim] = new Scale
  console.log scalesByDim
  return scalesByDim

extractScaleStmts = match
  Program: ({stmts}) ->
    compact map stmts, extractScaleStmts
  Scale: (s) -> s
  AST: ->

module.exports = processScaleStmts
