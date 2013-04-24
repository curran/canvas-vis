class AST

class Program extends AST
  constructor: (@stmts) ->

class Statement extends AST

class Data extends Statement
  constructor: (@left, @right) ->

class Expr extends AST

class Primitive extends Expr
  constructor: (@value) ->

class Name extends Primitive

AST.Program = Program
AST.Statement = Statement
AST.Data = Data
AST.Expr = Expr
AST.Primitive = Primitive
AST.Name = Name
module.exports = AST
