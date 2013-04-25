_ = require 'underscore'
match = require './match.coffee'

class AST

class Program extends AST
  constructor: (@stmts) ->

class Stmt extends AST

class Data extends Stmt
  constructor: (@name, @expr) ->

class Scale extends Stmt
  constructor: (@fn) ->

class Coord extends Stmt
  constructor: (@fn) ->

class Guide extends Stmt
  constructor: (@fn) ->

class Element extends Stmt
  constructor: (@fn) ->

class Expr extends AST

class Fn extends Expr
  constructor: (@name, @args) ->

class Op extends Expr
  constructor: (@left, @right) ->

class Primitive extends Expr
  constructor: (@value) ->

class Cross extends Op

class Name extends Primitive

class Str extends Primitive

class Num extends Primitive


show = match
  Program: ({stmts}) -> (_.map stmts, show).join '\n'
  Data: ({name, expr}) -> "DATA: #{name} = #{show expr}"
  Scale: ({fn}) -> "SCALE: #{show fn}"
  Coord: ({fn}) -> "COORD: #{show fn}"
  Guide: ({fn}) -> "GUIDE: #{show fn}"
  Element: ({fn}) -> "ELEMENT: #{show fn}"
  Primitive: ({value}) -> value
  Str: ({value}) -> '"'+value+'"'
  Fn: ({name, args}) -> "#{name}(#{(_.map args, show).join ', '})"
  Cross: ({left, right}) -> "#{show left}*#{show right}"

_.extend AST, {
  Program, Stmt, Data, Scale, Coord, Guide, Element,
  Expr, Primitive, Name, Str, Num, Fn, Cross, show
}
module.exports = AST
