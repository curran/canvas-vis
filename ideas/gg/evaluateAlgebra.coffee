match = require './match.coffee'
Relation = require './Relation.coffee'
AST = require './AST.coffee'
Program = AST.Program
Element = AST.Element
Fn = AST.Fn
Cross = AST.Cross
_ = require 'underscore'
map = _.map
compact = _.compact

# evaluateAlgebra(ast, vars) -> ast
# where Op expressions are replaced by Relations

evaluateAlgebra = (ast, vars, callback) ->
  algebra = match
    Program: ({stmts}) -> new Program map stmts, algebra
    Element: ({fn}) -> new Element 'ELEMENT', algebra fn
    Fn: ({name, args}) -> new Fn name, map args, algebra
    Cross: ({left, right, sym}) ->
      Relation.cross (algebra left), (algebra right)
    Name: ({value}) -> Relation.fromAttribute vars[value]
#    Name: ({value}) ->
##TODO change 'name.value' to 'name.name'
#      name = value
#      attribute = vars[name]
#      if attribute
#        Relation.fromAttribute attribute
#      else
#        callback missingAttrError name
    AST: (ast) -> ast
  algebra ast

missingAttrError = (name) -> """
  The attribute '#{name}' is not present in
  any loaded data tables. """


# TODO rename file to algebra.coffee
module.exports = evaluateAlgebra
