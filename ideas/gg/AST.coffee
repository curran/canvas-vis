class AST

class Program extends AST
  constructor: (@stmts) ->

class Stmt extends AST

class Data extends Stmt
  constructor: (@name, @expr) ->

class Expr extends AST

class Primitive extends Expr
  constructor: (@value) ->

class Name extends Primitive

class Str extends Primitive

AST.Program = Program
AST.Stmt = Stmt
AST.Data = Data
AST.Expr = Expr
AST.Primitive = Primitive
AST.Name = Name
AST.Str = Str
module.exports = AST
