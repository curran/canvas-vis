tests = require './tests.coffee'
getFile = require './getFile.coffee'
parse = (require './parser').parse
processSourceStmts = require './processSourceStmts.coffee'
processDataStmts = require './processDataStmts.coffee'
evaluateAlgebra = require './evaluateAlgebra.coffee'
show = require './show.coffee'

# Run unit tests for parser
tests()

# Evaluate the Grammar of Graphics expression
getFile 'gg/scatter.gg', (err, expr) -> evaluate expr, canvas

evaluate = (expr, canvas) ->
  ast = parse expr
  processSourceStmts ast, (err, vars) ->
    vars = processDataStmts ast, vars
    ast = evaluateAlgebra ast, vars
    console.log show ast
