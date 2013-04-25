_ = require 'underscore'
match = require './match.coffee'

class AST

class Program extends AST
  constructor: (@stmts) ->

class Stmt extends AST

class Data extends Stmt
  constructor: (@name, @expr) ->

class FnStmt extends Stmt
  constructor: (@label, @fn) ->

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

class Op extends Expr
  constructor: (@left, @right, @sym) ->

Op.create = (left, right, sym) ->
  switch sym
    when '*' then new Cross left, right, sym
    when '+' then new Blend left, right, sym
    when '/' then new Nest left, right, sym

class Cross extends Op

class Blend extends Op

class Nest extends Op

class Primitive extends Expr
  constructor: (@value) ->

class Name extends Primitive

class Str extends Primitive

class Num extends Primitive

show = match
  Program: ({stmts}) -> (_.map stmts, show).join '\n'
  Data: ({name, expr}) -> "DATA: #{name} = #{show expr}"
  FnStmt : ({label, fn}) -> "#{label}: #{show fn}"
  Primitive: ({value}) -> value
  Str: ({value}) -> '"'+value+'"'
  Fn: ({name, args}) -> "#{name}(#{(_.map args, show).join ', '})"
  Op: ({left, right, sym}) -> "#{show left}#{sym}#{show right}"

_.extend AST, {
  Program, Stmt, Data, FnStmt, Scale, Coord, Guide, Element,
  Expr, Primitive, Name, Str, Num, Fn, Op, Cross, Blend, Nest, show
}
module.exports = AST
