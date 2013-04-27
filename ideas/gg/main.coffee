parser = require './parser.js'
parse = parser.parse
match = require './match.coffee'
AST = require './AST.coffee'
show = AST.show
Relation = require './Relation.coffee'
_ = require 'underscore'
map = _.map
compact = _.compact
identity = _.identity
async = require 'async'

e = (actual, expected) -> if actual != expected
  throw new Error "Expected '#{expected}', got '#{actual}'"

check = (expr) -> e (show parse expr), expr
check 'DATA: x = y'
check """
  DATA: x = y
  DATA: q = z
"""
check 'DATA: x = "sepal length"'
check 'SOURCE: iris = "data/iris.csv"'
check 'ELEMENT: point(position(x*y))'
check 'ELEMENT: point(position(x+y))'
check 'ELEMENT: point(position(x/y))'

expr = """
SOURCE: iris = "data/iris.csv"
DATA: x = "petal length"
DATA: y = "sepal length"
SCALE: linear(dim(1))
SCALE: linear(dim(2))
COORD: rect(dim(1, 2))
GUIDE: axis(dim(1))
GUIDE: axis(dim(2))
ELEMENT: point(position(x*y))
"""

check expr
console.log 'All tests passed!'

# callback(err, text)
getFile = (path, callback) ->
  # TODO handle error case for missing files
  $.get path, (text) -> callback null, text

csvToRelation = (csvText) ->
  new Relation $.csv.toArrays csvText

extractSources = match
  Program: ({stmts}) -> compact map stmts, extractSources
  Source: identity
  AST: ->

# callback(err, [name:String, Relation])
getNamedRelation = (source, callback) ->
  getFile source.csvPath, (err, csvText) ->
    relation = csvToRelation csvText
    callback null, [source.name, relation]

# callback(err, [[name:String, Relation]])
getNamedRelations = (sources, callback) ->
  async.map sources, getNamedRelation, callback

ast0 = parse expr
sources = extractSources ast0
getNamedRelations sources, (err, namedRelations) ->
  console.log namedRelations
