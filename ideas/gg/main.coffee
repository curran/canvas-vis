parser = require './parser.js'
parse = parser.parse
match = require './match.coffee'
AST = require './AST.coffee'
show = AST.show
Relation = require './Relation.coffee'

e = (actual, expected) -> if actual != expected
  throw new Error "Expected '#{expected}', got '#{actual}'"

check = (expr) -> e (show parse expr), expr
check 'DATA: x = y'
check """
DATA: x = y
DATA: q = z
"""
check 'DATA: x = "sepal length"'
check 'ELEMENT: point(position(x*y))'
check 'ELEMENT: point(position(x+y))'
check 'ELEMENT: point(position(x/y))'

# SOURCE: "data/iris.csv"
expr = """
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

#ast0 = parse expr
#ast1 = processSources ast
#check = (expr) -> e (show parse expr), expr

#TODO next: pull pipeline from CSV to graphic, thu grammar
# Step 1. add SOURCE statements for loading CSV files
# SOURCE: "iris.csv"
#
# ELEMENT: point(position(x*y))
#
$.get 'data/iris.csv', (data) ->
  table = $.csv.toArrays data
  console.log table
  relation = new Relation table

