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

class Primitive extends Expr
  constructor: (@value) ->

class Name extends Primitive

class Str extends Primitive

class Num extends Primitive

class Fn extends Expr
  constructor: (@name, @args) ->

show = match
  Program: ({stmts}) -> (_.map stmts, show).join '\n'
  Data: ({name, expr}) -> "DATA: #{name} = #{show expr}"
  Scale: ({fn}) -> "SCALE: #{show fn}"
  Coord: ({fn}) -> "COORD: #{show fn}"
  Guide: ({fn}) -> "GUIDE: #{show fn}"
  Primitive: ({value}) -> value
  Str: ({value}) -> '"'+value+'"'
  Fn: ({name, args}) -> "#{name}(#{(_.map args, show).join ', '})"

_.extend AST, {
  Program, Stmt, Data, Scale, Coord, Guide, Element,
  Expr, Primitive, Name, Str, Num, Fn, show
}
module.exports = AST
