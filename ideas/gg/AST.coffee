_ = require 'underscore'
type = require './type.coffee'

class AST

class Program extends AST
  constructor: (@stmts) ->

class Stmt extends AST

class Source extends Stmt
  constructor: (@csvPath) ->
    type @csvPath, String

class Data extends Stmt
  constructor: (@name, @expr) ->
    type @name, String
    # type @expr Name or String

class FnStmt extends Stmt
  constructor: (@label, @fn) ->
    type @label, String
    type @fn, Fn

FnStmt.create = (label, fn) ->
  switch label
    when 'SCALE' then new Scale label, fn
    when 'COORD' then new Coord label, fn
    when 'GUIDE' then new Guide label, fn
    when 'ELEMENT' then new Element label, fn

class Scale extends FnStmt

class Coord extends FnStmt

class Guide extends FnStmt

class Element extends FnStmt

class Expr extends AST

class Fn extends Expr
  constructor: (@name, @args) ->
    type @name, String
# type @args, Array<Expr>

class Op extends Expr
  constructor: (@left, @right, @sym) ->
    type @left, Name
    type @right, Expr

Op.create = (left, right, sym) ->
  switch sym
    when '*' then new Cross left, right, sym
    when '+' then new Blend left, right, sym
    when '/' then new Nest left, right, sym

class Cross extends Op

class Blend extends Op

class Nest extends Op

class Primitive extends Expr

class Name extends Primitive
  constructor: (@value) ->
    type @value, String

class Str extends Primitive
  constructor: (@value) ->
    type @value, String

class Num extends Primitive
  constructor: (@value) ->
    type @value, Number

_.extend AST, {
  Program, Stmt, Data, Source, FnStmt,
  Scale, Coord, Guide, Element,
  Expr, Primitive, Name, Str, Num, Fn,
  Op, Cross, Blend, Nest
}
module.exports = AST
