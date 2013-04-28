# Tests for the parser
parse = (require './parser.js').parse
show = require './show.coffee'

tests = ->
  check 'DATA: x = y'
  check """
    DATA: x = y
    DATA: q = z
  """
  check 'DATA: x = "sepal length"'
  check 'SOURCE: "data/iris.csv"'
  check 'ELEMENT: point(position(x*y))'
  check 'ELEMENT: point(position(x+y))'
  check 'ELEMENT: point(position(x/y))'
  check """
    SOURCE: "data/iris.csv"
    DATA: x = "petal length"
    DATA: y = "sepal length"
    SCALE: linear(dim(1))
    SCALE: linear(dim(2))
    COORD: rect(dim(1, 2))
    GUIDE: axis(dim(1))
    GUIDE: axis(dim(2))
    ELEMENT: point(position(x*y))
  """
  console.log 'All tests passed!'

check = (expr) -> assertEq (show parse expr), expr

assertEq = (actual, expected) -> if actual != expected
  throw new Error "Expected '#{expected}', got '#{actual}'"

module.exports = tests
