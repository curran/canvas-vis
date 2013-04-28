match = require './match.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact
AST = require './AST.coffee'
Program = AST.Program
Element = AST.Element
Stmt = AST.Stmt
Fn = AST.Fn
Cross = AST.Cross

# evaluateAlgebra(ast, vars) -> ast
# where Op expressions are replaced by Relations
evaluateAlgebra = match
  Program: ({stmts}) -> new Program map stmts, evaluateAlgebra
  Element: ({fn}) -> new Element 'ELEMENT', evaluateAlgebra fn
  Fn: ({name, args}) -> new Fn name, map args, evaluateAlgebra
  Cross: ({left, right, sym}) ->
    new AST.Str "<Relation>"# left, right, sym
  AST: (ast) -> ast

module.exports = evaluateAlgebra
